<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Button,
    Card,
    Checkbox,
    Input,
    Label,
    Modal,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import LibraryCardService from "../services/LibraryCardService";
  import VisitorService from "../services/VisitorService";
  import BookCopyService from "../services/BookCopyService";
  import BookService from "../services/BookService";
  import PublisherService from "../services/PublisherService";
  import BorrowedService from "../services/BorrowedService";
  import { format } from "date-fns";

  let libraryCardService = new LibraryCardService();
  let visitorService = new VisitorService();
  let bookCopyService = new BookCopyService();
  let bookService = new BookService();
  let publisherService = new PublisherService();
  let borrowedService = new BorrowedService();
  let crumbs = [
    {
      href: "#/book/record",
      title: "Book",
    },
    {
      href: "#/book/return",
      title: "Return",
    },
  ];

  let borrower = null;
  let borrowed_books = [];
  let return_books = [];
  let selected_books = [];
  let processing = false;
  let openBarcode = false;

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
      let card = await libraryCardService.getOne("card_number", card_barcode);

      if(!card) {
        return alert(`Card number ${card_barcode} not found!`);
      }

      let visitor = await visitorService.get(card.visitor_id);

      borrower = {
        card,
        visitor,
      };

      stopBarcodeCardScanner();
      loadBorrowedBooks(borrower);
    }
  }

  const loadBorrowedBooks = async (borrower) => {
    let items = await borrowedService.getBy('library_card_id', borrower.card.id);
    let borrowed_items = [];

    for(let i=0; i<items.length; i++) {
      let item = items[i];
      let book_copy = await bookCopyService.get(item.book_copy_id);
      let book = await bookService.get(book_copy.book_id);
      let publisher = await publisherService.get(book.publisher_id)
      let borrowed = {
        ...item,
        book_copy: book_copy,
        book: book,
        publisher: publisher,
      }

      borrowed_items.push(borrowed);
    }

    borrowed_books = [...borrowed_items];
  }

  const handleBookBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let book_barcode = event.target.value;
      let book_copy = await bookCopyService.getOne("barcode", book_barcode);

      event.target.value = "";
      if(!book_copy) {
        return alert(`No match found for ${book_barcode}.`);
      }

      let borrowed = {
        book_copy: book_copy,
      }

      returnBorrowedBook(borrowed);
    }
  };

  const returnBorrowedBook = (borrowed) => {
    let index = borrowed_books.findIndex(book => book.book_copy.id == borrowed.book_copy.id);

    if(index == -1) {
      return alert("Book is not on the list.");
    }

    borrowed = borrowed_books[index];
    // @ts-ignore
    selected_books = [...selected_books, borrowed.book_copy.id];
    returnBook(borrowed);
  }

  const returnBook = (borrowed) => {
    let index = return_books.findIndex(book => book.book_copy.id == borrowed.book_copy.id);

    if(index >= 0) {
      return alert("Book already selected.");
    }

    return_books = [...return_books, borrowed];
    console.log({return_books});
  }


  const removeReturnBook = (borrowed) => {
    let books = return_books.filter(book => book.book_copy.id != borrowed.book_copy.id);

    return_books = [...books];
    selected_books = selected_books.filter(selected => selected != borrowed.book_copy.id);
    console.log({return_books});
  }

  const handleChange = async (event, borrowed) => {
    let checkbox = event.target;

    if(checkbox.checked) {
      returnBook(borrowed);
    } else {
      removeReturnBook(borrowed);
    }
  }
 
  const processReturnedBooks = async () => {
    processing = true;

    for(let i=0; i<return_books.length; i++) {
      let borrowed_book = return_books[i];
      let borrowedFormData = new FormData();
      borrowedFormData.set('id', borrowed_book.id);
      borrowedFormData.set('returned_date', format(new Date(), 'yyyy-MM-dd'));

      await borrowedService.update(borrowedFormData);

      let bookCopyFormData = new FormData();
      bookCopyFormData.set('id', borrowed_book.book_copy.id);
      bookCopyFormData.set('status', 'Available');

      await bookCopyService.update(bookCopyFormData);
    }

    alert("Successfully processed returned books.");
    processing = false;
    borrowed_books = [];
    return_books = [];
    selected_books = [];
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
                {borrower.visitor.first_name}
                {borrower.visitor.last_name}
                ({borrower.visitor.type})
              {/if}
            </span><br />
          </section>
          <section class="w-1/2">
            <span class="w-32 inline-block">Card Number: </span>
            <span>
              {#if borrower}
                {borrower.card.card_number}
              {/if}
            </span>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              href="#"
              on:click|preventDefault={() => startCardScanner()}
              class="mx-5 float-right font-medium text-primary-600 hover:underline dark:text-primary-500"
              >SET</a>
          </section>
        </div>

        {#if borrower && borrowed_books.length}
          <Card size="xl">
            <div class="flex justify-between items-center">
              <Label for="barcode" class="block me-5 text-lg w-32 text-center">
                Barcode
              </Label>
              <Input
                disabled={processing} 
                id="barcode"
                placeholder="Enter or scan book's barcode."
                on:keyup={handleBookBarcodeKeyup}
              />
              <Button 
                disabled={processing} 
                class="ms-5 w-32">Clear</Button>
            </div>
          </Card>
        {/if}
      </section>

      {#if borrower}
        <section class="books-section">
          <Table hoverable={true}>
            <TableHead>
              <TableHeadCell class="!p-4">
                <Checkbox />
              </TableHeadCell>
              <TableHeadCell>Barcode</TableHeadCell>
              <TableHeadCell>Book title</TableHeadCell>
              <TableHeadCell>Publication Year</TableHeadCell>
              <TableHeadCell>Borrowed Date</TableHeadCell>
              <TableHeadCell class="text-center">Action</TableHeadCell>
            </TableHead>
            <TableBody>
              {#each borrowed_books as borrowed}
                <TableBodyRow>
                  <TableBodyCell class="!p-4">
                    <Checkbox 
                      bind:group={selected_books}
                      on:change={(event) => handleChange(event, borrowed)}
                      value={borrowed.book_copy.id}
                    />
                  </TableBodyCell>
                  <TableBodyCell>{borrowed.book_copy.barcode}</TableBodyCell>
                  <TableBodyCell>{borrowed.book.title}</TableBodyCell>
                  <TableBodyCell>{borrowed.book.publication_year}</TableBodyCell>
                  <TableBodyCell>{borrowed.borrowed_date}</TableBodyCell>
                  <TableBodyCell>
                    <Button 
                      disabled={processing} 
                      color="red" 
                      size="sm" 
                      class="gap-2"
                    >
                      Missing
                    </Button>
                  </TableBodyCell>
                </TableBodyRow>
              {:else}  
                <TableBodyRow>
                  <TableBodyCell colspan="6" class="text-center">
                    No borrowed books.
                  </TableBodyCell>
                </TableBodyRow>
              {/each}
            </TableBody>
          </Table>
        </section>
      {/if}

      {#if borrower && return_books.length}
        <Card size="xl" class="mt-4">
          <Button 
            disabled={processing} 
            on:click={processReturnedBooks}
          >
            {#if processing}<Spinner size={4} class="me-2" />{/if}
            Process Books to Return
          </Button>
        </Card>
      {/if}
    </div>
  </main>

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
