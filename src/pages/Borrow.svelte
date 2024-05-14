<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Button,
    Card,
    Checkbox,
    Input,
    Modal,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import BookCopyService from "../services/BookCopyService";
  import BookService from "../services/BookService";
  import PublisherService from "../services/PublisherService";
  import BorrowedService from "../services/BorrowedService";
  import ReserveService from "../services/ReserveService";
  import { addDays, format } from "date-fns";
  import MemberService from "../services/MemberService";
  import WishlistService from "../services/WishlistService";

  let bookCopyService = new BookCopyService();
  let bookService = new BookService();
  let memberService = new MemberService();
  let publisherService = new PublisherService();
  let borrowedService = new BorrowedService();
  let reserveService = new ReserveService();
  let wishlistService = new WishlistService();
  let openWebcam = false;
  let openBarcode = false;
  let crumbs = [
    {
      href: "#/book/record",
      title: "Book",
    },
    {
      href: "#/book/borrow",
      title: "Borrow",
    },
  ];

  let borrower = null;
  let to_borrow_books = [];
  let selected_books = [];
  let reserved_books = [];
  let processing = false;

  const startBarcodeCardScanner = () => {
    openBarcode = true;
    setTimeout(() => {
      // @ts-ignore
      document.querySelector('#barcode_card_scanner').focus();
    }, 100);
  }

  const stopBarcodeCardScanner = () => {
    openBarcode = false;
  }

  const stopCardScanner = () => {
    stopBarcodeCardScanner();
  }

  const startCardScanner = () => {
    startBarcodeCardScanner();
  }

  const handleCardBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let card_barcode = event.target.value;
      event.target.value = "";
      let member = await memberService.getOne("card_number", card_barcode);

      if(!member) {
        return alert(`Card number ${card_barcode} not found!`);
      }

      borrower = {...member};
      stopBarcodeCardScanner();
    }
  }

  const handleBookBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let book_barcode = event.target.value;
      let book_copy = await bookCopyService.getOne("barcode", book_barcode);

      event.target.value = "";
      if(!book_copy) {
        return alert(`No match found for ${book_barcode}.`);
      }

      let book = await bookService.get(book_copy.book_id);
      let publisher = await publisherService.get(book.publisher_id)
      let to_borrow = {
        book_copy: book_copy,
        book: book,
        publisher: publisher,
      }

      borrowBook(to_borrow);
    }
  };

  const handleQueuingKeyup = async (event) => {
    if (event.key === "Enter") {
      let queuingNumber = event.target.value;
      let items = await reserveService.getBy('number', queuingNumber);

      reserved_books = [...items];
      console.log(reserved_books);

      for(let i=0; i < items.length; i++) {
        let book = await bookService.get(items[i].book_id);
        let publisher = await publisherService.get(book.publisher_id)
        let to_borrow = {
          book: book,
          publisher: publisher,
        }

        borrowBook(to_borrow);
      }

      if(!items.length) {
        to_borrow_books = [];
        selected_books = [];
      }
    }
  }

  const borrowBook = (to_borrow) => {
    if(to_borrow.book_copy) {
      if(to_borrow.book_copy.status != 'Available') {
        return alert(`Cannot borrow book because it was marked as ${to_borrow.book_copy.status.toLowerCase()}.`);
      }

      let index = to_borrow_books.findIndex(book => book.book_copy?.id == to_borrow.book_copy.id);

      if(index >= 0) {
        return alert("Book already added.");
      }

      index = to_borrow_books.findIndex(item => item.book.id == to_borrow.book.id);
      
      if(index >= 0) {
        let items = to_borrow_books.filter(item => item.book.id != to_borrow.book.id)
        to_borrow_books = [...items, to_borrow];
        selected_books = [...selected_books, to_borrow.book_copy.id];
        return
      }
    }

    to_borrow_books = [...to_borrow_books, to_borrow];
  }

  const handleChange = async (event, to_borrow) => {
    let checkbox = event.target;

    if(checkbox.checked) {
      selected_books = [...selected_books, to_borrow.book_copy.id];
    } else {
      removeToBorrowBook(to_borrow);
    }
  }

  const removeToBorrowBook = (to_borrow) => {
    let borrow = confirm("Remove this book?");

    if(borrow) {
      to_borrow_books = to_borrow_books.filter(book => book.book_copy.id != to_borrow.book_copy.id);
    }
  }

  const processBorrowedBooks = async () => {
    processing = true;

    let formDatas = to_borrow_books
      .filter(to_borrow => {
        return selected_books.includes(to_borrow.book_copy?.id)
      })
      .map(to_borrow => {
        let formData = new FormData();
        formData.set('book_copy_id', to_borrow.book_copy.id);
        formData.set('member_id', borrower.id);
        formData.set('borrowed_date', format(new Date(), 'yyyy-MM-dd'))
        formData.set('due_date', format(addDays(new Date(), 7), 'yyyy-MM-dd'))
        
        return formData;
      });

    for(let i=0; i<formDatas.length; i++) {
      let formData = formDatas[i];

      await borrowedService.add(formData);

      let updateFormData = new FormData();
      updateFormData.set('id', formData.get('book_copy_id'));
      updateFormData.set('status', 'Borrowed');

      await bookCopyService.update(updateFormData);
    }


    let wishlist_books = to_borrow_books
      .filter(to_borrow => {
        return !(selected_books.includes(to_borrow.book_copy?.id))
      })
    
    for(let i=0; i<wishlist_books.length; i++) {
      let wishlist_book = wishlist_books[i];
      let formData = new FormData();

      formData.set('book_id', wishlist_book.book.id);
      formData.set('member_id', borrower.id);

      await wishlistService.add(formData);
    }
    // @ts-ignore
    await reserveService.deleteBy('number', document.querySelector('#queuing').value);

    alert("Successfully processed borrowed books.");
    processing = false;
    to_borrow_books = [];
    borrower = null;
  }

</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="p-3">
      <section class="barcode-section mb-5">
        <div class="flex p-5 dark:text-white border mb-5 rounded-lg">
          <section class="w-1/2">
            <span class="w-32 inline-block">Borrower Name: </span>
            <span>
              {#if borrower}
                {borrower.first_name}
                {borrower.last_name}
                ({borrower.type})
              {/if}
            </span><br />
          </section>
          <section class="w-1/2">
            <span class="w-32 inline-block">Card Number: </span>
            <span>
              {#if borrower}
                {borrower.card_number}
              {/if}
            </span>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              href="#"
              on:click|preventDefault={() => startCardScanner()}
              class="mx-5 float-right font-medium text-primary-600 hover:underline dark:text-primary-500"
              >SET</a
            >
          </section>
        </div>
        <Card size="xl">
          <div class="flex justify-between items-center">
            <Input
              disabled={processing} 
              id="barcode"
              placeholder="Enter or scan book's barcode."
              class="mx-2"
              on:keyup={handleBookBarcodeKeyup}
            />
            <Input
              disabled={processing} 
              id="queuing"
              placeholder="Enter or scan queuing number."
              class="mx-2"
              on:keyup={handleQueuingKeyup}
            />
          </div>
        </Card>
      </section>

      <section class="books-section">
        <Table hoverable={true}>
          <TableHead>
            <TableHeadCell class="!p-4">
              <Checkbox />
            </TableHeadCell>
            <TableHeadCell>Barcode</TableHeadCell>
            <TableHeadCell>Book title</TableHeadCell>
            <TableHeadCell>Publication Year</TableHeadCell>
            <TableHeadCell>Publisher</TableHeadCell>
            <TableHeadCell class="text-center">Action</TableHeadCell>
          </TableHead>
          <TableBody>
            {#each to_borrow_books as to_borrow}
              <TableBodyRow>
                <TableBodyCell class="!p-4">
                  {#if to_borrow.book_copy}
                    <Checkbox 
                      bind:group={selected_books}
                      on:change={(event) => handleChange(event, to_borrow)}
                      value={to_borrow.book_copy.id}
                    />   
                  {:else}
                    <Checkbox disabled />
                  {/if}            
                </TableBodyCell>
                <TableBodyCell>{to_borrow.book_copy?.barcode ?? ""}</TableBodyCell>
                <TableBodyCell>{to_borrow.book.title}</TableBodyCell>
                <TableBodyCell>{to_borrow.book.publication_year}</TableBodyCell>
                <TableBodyCell>{to_borrow.publisher.name}</TableBodyCell>
                <TableBodyCell>
                  {#if to_borrow.book_copy}
                  <Button 
                    disabled={processing} 
                    on:click={() => removeToBorrowBook(to_borrow)} 
                    color="red" 
                    size="sm" 
                    class="gap-2"
                  >
                    <TrashBinSolid size="sm" />
                  </Button>
                  {/if}
                </TableBodyCell>
              </TableBodyRow>
            {:else}  
              <TableBodyRow>
                <TableBodyCell colspan="6" class="text-center">
                  No items found.
                </TableBodyCell>
              </TableBodyRow>
            {/each}
          </TableBody>
        </Table>
      </section>
      {#if borrower && selected_books.length}
        <Card size="xl" class="mt-4">
          <Button 
            disabled={processing} 
            on:click={processBorrowedBooks}
          >
            {#if processing}<Spinner size={4} class="me-2" />{/if}
            Process Books to Borrow
          </Button>
        </Card>
      {/if}
    </div>
  </main>

  <Modal
    title="Library Card Scanner"
    bind:open={openWebcam}
    placement="top-center"
    size="xs"
    autoclose
    on:close={() => stopCardScanner()}
  >
    <div id="webcam_card_scanner" class="mx-auto" style="width: 350px;"></div>
    <svelte:fragment slot="footer">
      <Button color="alternative">Close</Button>
    </svelte:fragment>
  </Modal>
  <Modal
    title="Library Card Scanner"
    bind:open={openBarcode}
    placement="top-center"
    size="xs"
    autoclose
    on:close={() => stopCardScanner()}
  >
    <div class="p-5">
    <Input 
      disabled={processing} 
      on:keyup={handleCardBarcodeKeyup} 
      id="barcode_card_scanner" 
      placeholder="Enter or scan library card number" 
    />
    </div>
    <svelte:fragment slot="footer">
      <Button color="alternative">Close</Button>
    </svelte:fragment>
  </Modal>
</Layout>
