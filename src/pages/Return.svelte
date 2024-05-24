<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Avatar,
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
    Heading,
  } from "flowbite-svelte";
  import BookCopyService from "../services/BookCopyService";
  import BookService from "../services/BookService";
  import PublisherService from "../services/PublisherService";
  import BorrowedService from "../services/BorrowedService";
  import { differenceInCalendarDays, format } from "date-fns";
  import MemberService from "../services/MemberService";
  import SettingService from "../services/SettingService";
  import { onMount } from "svelte";
  import MessageModal from "../components/MessageModal.svelte";

  let memberService = new MemberService();
  let bookCopyService = new BookCopyService();
  let bookService = new BookService();
  let publisherService = new PublisherService();
  let borrowedService = new BorrowedService();
  let settingService = new SettingService();
  let message = null;

  let decimal = Intl.NumberFormat('en-PH', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  let { HOST } = CONFIG;

  let crumbs = [
    {
      href: "#/transact",
      title: "Transact",
    },
    {
      href: "#/transact/return",
      title: "Return",
    },
  ];

  let borrower = null;
  let borrowed_books = [];
  let return_books = [];
  let selected_books = [];
  let processing = false;

  let asyncItems;


  const handleMessageClose = () => {
    message = null;
    console.log(message);
  }

  const handleCardBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let card_barcode = event.target.value;
      event.target.value = "";
      let member = await memberService.getOne("card_number", card_barcode);

      if (!member) {
        return alert(`Card number ${card_barcode} not found!`);
      }

      borrower = { ...member };
      asyncItems = loadBorrowedBooks(borrower);
    }
  };

  const loadBorrowedBooks = async (borrower) => {
    console.log({ borrower });
    let items = await borrowedService.getBy("member_id", borrower.id);
    let borrowed_items = [];

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let book_copy = await bookCopyService.get(item.book_copy_id);
      let book = await bookService.get(book_copy.book_id);
      let publisher = await publisherService.get(book.publisher_id);
      let borrowed = {
        ...item,
        book_copy: book_copy,
        book: book,
        publisher: publisher,
      };

      borrowed_items.push(borrowed);
    }

    borrowed_books = [...borrowed_items];
  };

  const handleBookBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let book_barcode = event.target.value;
      let book_copy = await bookCopyService.getOne("barcode", book_barcode);

      event.target.value = "";
      if (!book_copy) {
        return alert(`No match found for ${book_barcode}.`);
      }

      let borrowed = {
        book_copy: book_copy,
      };

      returnBorrowedBook(borrowed);
    }
  };

  const returnBorrowedBook = (borrowed) => {
    let index = borrowed_books.findIndex(
      (book) => book.book_copy.id == borrowed.book_copy.id
    );

    if (index == -1) {
      return alert("Book is not on the list.");
    }

    borrowed = borrowed_books[index];
    // @ts-ignore
    selected_books = [...selected_books, borrowed.book_copy.id];
    returnBook(borrowed);
  };

  const returnBook = (borrowed) => {
    let index = return_books.findIndex(
      (book) => book.book_copy.id == borrowed.book_copy.id
    );

    if (index >= 0) {
      return alert("Book already selected.");
    }

    return_books = [...return_books, borrowed];
    console.log({ return_books });
  };

  const removeReturnBook = (borrowed) => {
    let books = return_books.filter(
      (book) => book.book_copy.id != borrowed.book_copy.id
    );

    return_books = [...books];
    selected_books = selected_books.filter(
      (selected) => selected != borrowed.book_copy.id
    );
    console.log({ return_books });
  };

  const handlePenaltyPayment = async (e) => {
    let form = e.target;
    let formData = new FormData(form);

    let payment = parseFloat(formData.get('payment') + '');
    
    if(payment < penalty) {
      message = {
        text: 'Insufficient payment!',
        type: 'warning',
      }
    } else {
      let changeAmount = payment - penalty;
      penalty = 0;
      await processReturnedBooks();

      message = {
        text: `Successfully returned the books! <br>Change amount is <b>${decimal.format(changeAmount)}</b>.`,
        type: 'success',
      };
    }
  }

  const handleChange = async (event, borrowed) => {
    let checkbox = event.target;

    if (checkbox.checked) {
      returnBook(borrowed);
    } else {
      removeReturnBook(borrowed);
    }
  };

  const computePenalties = () => {
    let totalPenalties = 0;

    for (let i = 0; i < return_books.length; i++) {
      let borrowed_book = return_books[i];
      let today = new Date();
      let due_date = new Date(borrowed_book.due_date);
      let date_difference = differenceInCalendarDays(today, due_date);
      let penalty = date_difference * penalty_per_day;

      if (penalty > 0) {
        totalPenalties += penalty;
      }
    }

    return totalPenalties;
  };

  let penalty = 0;
  const settlePenalties = async () => {
    let totalPenalties = computePenalties();

    if (totalPenalties > 0) {
      penalty = totalPenalties;
    } else {
      penalty = 0;
    }
  }


  const processReturnedBooks = async () => {
    processing = true;

    for (let i = 0; i < return_books.length; i++) {
      let borrowed_book = return_books[i];
      let today = new Date();
      let due_date = new Date(borrowed_book.due_date);
      let date_difference = differenceInCalendarDays(today, due_date);
      let penalty = date_difference * penalty_per_day;

      let borrowedFormData = new FormData();
      borrowedFormData.set("id", borrowed_book.id);
      borrowedFormData.set("returned_date", format(new Date(), "yyyy-MM-dd"));

      if (penalty > 0) {
        borrowedFormData.set("penalty", penalty + "");
      }

      await borrowedService.update(borrowedFormData);

      let bookCopyFormData = new FormData();
      bookCopyFormData.set("id", borrowed_book.book_copy.id);
      bookCopyFormData.set("status", "Available");

      await bookCopyService.update(bookCopyFormData);
    }

    processing = false;
    borrowed_books = [];
    return_books = [];
    selected_books = [];
    borrower = null;
  };

  let penalty_per_day;

  onMount(async () => {
    let setting = await settingService.getOne("property", "penalty_per_day");
    penalty_per_day = parseFloat(setting.value);
  });

  let computedPenalties = 0;

  $: {
    if(return_books && return_books.length) {
      computedPenalties = computePenalties();
    } else {
      computedPenalties = 0;
    }
  }

  let submitPenaltyButton;
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <section class="barcode-section mb-5">
        <Card size="xl">
          <div class="flex items-center mb-3">
            <Label class="mx-2 w-full border-b">
              <span class="block mb-2">Borrower Name:</span>
              <div class="flex items-center" style="height: 42px;">
                {#if borrower}
                  <Avatar
                    class="inline-bloc me-2"
                    rounded
                    src={`${HOST}/static/uploads/${borrower.photo}`}
                  />
                  <span class="font-semibold text-lg uppercase">
                    {borrower.last_name}
                    {borrower.first_name} - {borrower.card_number} ({borrower.type})
                  </span>
                {/if}
              </div>
            </Label>
          </div>
          <div class="flex justify-between items-center">
            <Label class="mx-2 w-full">
              <span class="block mb-2">Book's barcode:</span>
              <Input
                disabled={processing}
                id="barcode"
                placeholder="Enter or scan book's barcode."
                on:keyup={handleBookBarcodeKeyup}
              />
            </Label>
            <Label class="mx-2 w-full">
              <span class="block mb-2">Card number:</span>
              <Input
                disabled={processing}
                on:keyup={handleCardBarcodeKeyup}
                id="barcode_card_scanner"
                placeholder="Enter or scan student/card number"
              />
            </Label>
          </div>
        </Card>
      </section>

      {#if borrower}
        <section class="books-section">
          <Table hoverable={true}>
            <TableHead>
              <TableHeadCell class="!p-4">
                <Checkbox />
              </TableHeadCell>
              <TableHeadCell>Borrowed Date</TableHeadCell>
              <TableHeadCell>Barcode</TableHeadCell>
              <TableHeadCell>Book Title</TableHeadCell>
              <TableHeadCell>Due Date</TableHeadCell>
              <TableHeadCell class="text-right">Penalty</TableHeadCell>
              <TableHeadCell class="text-right">Subtotal</TableHeadCell>
            </TableHead>
            <TableBody>
              {#await asyncItems}
                <TableBodyRow>
                  <TableBodyCell colspan={7} class="text-center"
                    >Loading borrowed books..</TableBodyCell
                  >
                </TableBodyRow>
              {:then books}
                {#each borrowed_books as borrowed}
                  {@const today = new Date()}
                  {@const due_date = new Date(borrowed.due_date)}
                  {@const date_difference = differenceInCalendarDays(
                    today,
                    due_date
                  )}
                  <TableBodyRow>
                    <TableBodyCell class="!p-4">
                      <Checkbox
                        bind:group={selected_books}
                        on:change={(event) => handleChange(event, borrowed)}
                        value={borrowed.book_copy.id}
                      />
                    </TableBodyCell>
                    <TableBodyCell>{borrowed.borrowed_date}</TableBodyCell>
                    <TableBodyCell>{borrowed.book_copy.barcode}</TableBodyCell>
                    <TableBodyCell>{borrowed.book.title}</TableBodyCell>
                    <TableBodyCell>{borrowed.due_date}</TableBodyCell>
                    {#if date_difference > 0}
                      {@const penalty = date_difference * penalty_per_day}
                      <TableBodyCell class="text-right"
                        >{date_difference} x {decimal.format(penalty_per_day)}</TableBodyCell
                      >
                      <TableBodyCell class="text-right">{decimal.format(penalty)}</TableBodyCell
                      >
                    {:else}
                      <TableBodyCell></TableBodyCell>
                      <TableBodyCell></TableBodyCell>
                    {/if}
                  </TableBodyRow>
                {:else}
                  <TableBodyRow>
                    <TableBodyCell colspan={7} class="text-center">
                      No borrowed books.
                    </TableBodyCell>
                  </TableBodyRow>
                {/each}
              {/await}
            </TableBody>
            {#if computedPenalties > 0}
              <tfoot>
                <tr>
                  <th colspan={6} class="text-right p-5 text-xl">Total Penalties: </th>
                  <th class="text-right p-5 text-xl">{decimal.format(computedPenalties)}</th>
                </tr>
              </tfoot>
            {/if}
          </Table>
        </section>
      {/if}

      {#if borrower && return_books.length}
        <Card size="xl" class="mt-4">
          <Button disabled={processing} on:click={settlePenalties}>
            {#if processing}<Spinner size={4} class="me-2" />{/if}
            Process Books to Return
          </Button>
        </Card>
      {/if}
    </div>

    {#if penalty > 0}
      <Modal title="Penalty Fee" size="sm" open={true} placement="top-center">
        <Heading tag="h1" class="text-center">
          {decimal.format(penalty)}
        </Heading>
        <form on:submit|preventDefault={handlePenaltyPayment}>
          <Label>
            <span class="mb-2 block">Enter amount paid:</span> 
            <Input type="number" 
              name="payment"
              placeholder="--amount--"
            />
          </Label>
          <input bind:this={submitPenaltyButton} type="submit" style="width: 0; height: 1px;">
        </form>
        <svelte:fragment slot="footer">
          <section class="text-right w-full">
            <Button on:click={() => { console.log('haha'); submitPenaltyButton.click(); }}>Process</Button>
          </section>
        </svelte:fragment>
      </Modal>
    {/if}

    {#if message} 
      <MessageModal open={true} {message} on:close={handleMessageClose} />
    {/if}
  </main>
</Layout>
