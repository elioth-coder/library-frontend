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
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
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
  let borrowed_books = [];
  let processing = false;

  let html5QrCode;
  const stopWebcamCardScanner = () => {
    html5QrCode.stop();
    openWebcam = false;
  };

  const startWebcamCardScanner = () => {
    openWebcam = true;
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          let cameraId = devices[0].id;
          html5QrCode = new Html5Qrcode("webcam_card_scanner");
          html5QrCode
            .start(
              cameraId,
              { fps: 10, qrbox: 300 },
              async (text, result) => {
                let card = await libraryCardService.getOne("card_number", text);
                let visitor = await visitorService.get(card.visitor_id);

                borrower = {
                  card,
                  visitor,
                };

                console.log({ borrower });
                openWebcam = false;
              },
              (error) => {}
            )
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  };

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
    // stopWebcamCardScanner();
    stopBarcodeCardScanner();
  }

  const startCardScanner = () => {
    // startWebcamCardScanner();
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
      let borrowed = {
        book_copy: book_copy,
        book: book,
        publisher: publisher,
      }

      addBorrowedBook(borrowed);
    }
  };

  const addBorrowedBook = (borrowed) => {
    if(borrowed.book_copy.status != 'Available') {
      return alert(`Cannot borrow book because it was markded as ${borrowed.book_copy.status.toLowerCase()}.`);
    }

    let index = borrowed_books.findIndex(book => book.book_copy.id == borrowed.book_copy.id);

    if(index >= 0) {
      return alert("Book already added.");
    }

    borrowed_books = [...borrowed_books, borrowed];
  }

  const removeBorrowedBook = (borrowed) => {
    let borrow = confirm("Remove this book?");

    if(borrow) {
      borrowed_books = borrowed_books.filter(book => book.book_copy.id != borrowed.book_copy.id);
    }
  }

  const processBorrowedBooks = async () => {
    processing = true;

    let formDatas = borrowed_books.map(borrowed => {
      let formData = new FormData();
      formData.set('book_copy_id', borrowed.book_copy.id);
      formData.set('library_card_id', borrower.card.id);
      formData.set('borrowed_date', format(new Date(), 'yyyy-MM-dd'))
      
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

    alert("Successfully processed borrowed books.");
    processing = false;
    borrowed_books = [];
    borrower = null;
  }
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <section class="barcode-section mb-5">
      <div class="flex p-5 dark:text-white">
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
          <a
            href="#"
            on:click|preventDefault={() => startCardScanner()}
            class="mx-5 float-right font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Change</a
          >
        </section>
      </div>
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
          <TableHeadCell>Action</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each borrowed_books as borrowed}
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>{borrowed.book_copy.barcode}</TableBodyCell>
              <TableBodyCell>{borrowed.book.title}</TableBodyCell>
              <TableBodyCell>{borrowed.book.publication_year}</TableBodyCell>
              <TableBodyCell>{borrowed.publisher.name}</TableBodyCell>
              <TableBodyCell>
                <Button 
                  disabled={processing} 
                  on:click={() => removeBorrowedBook(borrowed)} 
                  color="red" 
                  size="sm" 
                  class="gap-2"
                >
                  <TrashBinSolid size="sm" />
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {:else}  
            <TableBodyRow>
              <TableBodyCell colspan="6" class="text-center">
                No borrowed books yet.
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </section>
    {#if borrower && borrowed_books.length}
      <Card size="xl" class="mt-4">
        <Button 
          disabled={processing} 
          on:click={processBorrowedBooks}
        >
          {#if processing}<Spinner size={4} class="me-2" />{/if}
          Process Borrowed Books
        </Button>
      </Card>
    {/if}
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
