<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Avatar,
    Button,
    Card,
    Checkbox,
    CloseButton,
    Drawer,
    Input,
    Label,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { querystring, replace } from "svelte-spa-router";
  import { parse } from "qs";
  import { CheckCircleOutline, CheckOutline, InfoCircleSolid, TrashBinSolid } from "flowbite-svelte-icons";
  import BookCopyService from "../services/BookCopyService";
  import BookService from "../services/BookService";
  import BorrowedService from "../services/BorrowedService";
  import ReserveService from "../services/ReserveService";
  import { addDays, format } from "date-fns";
  import MemberService from "../services/MemberService";
  import WishlistService from "../services/WishlistService";
  import SettingService from "../services/SettingService";
  import { onMount } from "svelte";
  import { uniq } from "lodash-es";
  import MessageModal from "../components/MessageModal.svelte";
  import QueueService from "../services/QueueService";
  import { sineIn } from "svelte/easing";
  import BarcodeTextModal from "../components/BarcodeTextModal.svelte";

  let bookCopyService = new BookCopyService();
  let bookService = new BookService();
  let queueService = new QueueService();
  let memberService = new MemberService();
  let borrowedService = new BorrowedService();
  let reserveService = new ReserveService();
  let wishlistService = new WishlistService();
  let settingService = new SettingService();
  let message = null;
  let { HOST } = CONFIG;
  let crumbs = [
    {
      href: "#/transact",
      title: "Transact",
    },
    {
      href: "#/transact/borrow",
      title: "Borrow",
    },
  ];

  const handleMessageClose = () => {
    message = null;
  };

  let borrower = null;
  let to_borrow_books = [];
  let selected_books = [];
  let reserved_books = [];
  let processing = false;
  let borrow_duration = 0;

  const handleCardBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let card_barcode = event.target.value;
      event.target.value = "";
      let member = await memberService.getOne("card_number", card_barcode);

      if (!member) {
        message = {
          text: `Card number ${card_barcode} not found!`,
          type: "error",
        };

        return;
      }

      if(member.status != 'Approved') {
        message = {
          text: `Card number valid, not yet approved.`,
          type: "error",
        };

        return;
      }

      borrower = { ...member };
    }
  };

  const handleBookBarcodeKeyup = async (event) => {
    if (event.key === "Enter") {
      let book_barcode = event.target.value;
      let book_copy = await bookCopyService.getOne("barcode", book_barcode);

      event.target.value = "";
      if (!book_copy) {
        return alert(`No match found for ${book_barcode}.`);
      }

      let book = await bookService.get(book_copy.book_id);
      let to_borrow = {
        book_copy: book_copy,
        book: book,
      };

      borrowBook(to_borrow);
    }
  };

  const handleQueuingKeyup = async (event) => {
    if (event.key === "Enter") {
      let queuingNumber = event.target.value;
      let items = await reserveService.getBy("number", queuingNumber);
      let reservedItems = [];

      for (let i = 0; i < items.length; i++) {
        let book = await bookService.get(items[i].book_id);

        reservedItems.push(book);
      }

      reserved_books = [...reservedItems];
      hiddenDrawer = false;
    }
  };

  const borrowBook = (to_borrow) => {
    if (to_borrow.book_copy) {
      if (to_borrow.book_copy.status != "Available") {
        return alert(
          `Cannot borrow book because it was marked as ${to_borrow.book_copy.status.toLowerCase()}.`
        );
      }

      let filtered_to_borrow = to_borrow_books.filter((item) => {
        return item.book.id != to_borrow.book.id;
      });

      to_borrow_books = [...filtered_to_borrow, to_borrow];
      selected_books = uniq([...selected_books, to_borrow.book_copy.id]);

      return;
    }

    to_borrow_books = [...to_borrow_books, to_borrow];
  };

  const handleChange = async (event, to_borrow) => {
    let checkbox = event.target;

    if (checkbox.checked) {
      selected_books = [...selected_books, to_borrow.book_copy.id];
    } else {
      removeToBorrowBook(to_borrow);
    }
  };

  const removeToBorrowBook = (to_borrow) => {
    let borrow = confirm("Remove this book?");

    if (borrow) {
      to_borrow_books = to_borrow_books.filter(
        (book) => book.book_copy.id != to_borrow.book_copy.id
      );
    }
  };

  const processBorrowedBooks = async () => {
    processing = true;

    let formDatas = to_borrow_books
      .filter((to_borrow) => {
        return selected_books.includes(to_borrow.book_copy?.id);
      })
      .map((to_borrow) => {
        let formData = new FormData();
        formData.set("book_copy_id", to_borrow.book_copy.id);
        formData.set("member_id", borrower.id);
        formData.set("borrowed_date", format(new Date(), "yyyy-MM-dd"));
        console.log({ borrow_duration });
        formData.set(
          "due_date",
          format(addDays(new Date(), borrow_duration), "yyyy-MM-dd")
        );

        return formData;
      });

    for (let i = 0; i < formDatas.length; i++) {
      let formData = formDatas[i];

      await borrowedService.add(formData);

      let updateFormData = new FormData();
      updateFormData.set("id", formData.get("book_copy_id"));
      updateFormData.set("status", "Borrowed");

      await bookCopyService.update(updateFormData);
    }

    // let wishlist_books = to_borrow_books.filter((to_borrow) => {
    //   return !selected_books.includes(to_borrow.book_copy?.id);
    // });

    // for (let i = 0; i < wishlist_books.length; i++) {
    //   let wishlist_book = wishlist_books[i];
    //   let formData = new FormData();

    //   formData.set("book_id", wishlist_book.book.id);
    //   formData.set("member_id", borrower.id);
    //   formData.set("wished_date", format(new Date(), "yyyy-MM-dd"));

    //   await wishlistService.add(formData);
    // }
    // @ts-ignore
    let queueNumber = document.querySelector("#queuing").value;

    if(queueNumber) {
      await reserveService.deleteBy("number", queueNumber);
      await queueService.delete(queueNumber);
    }

    message = {
      text: "Successfully processed borrowed books.",
      type: "success",
    };

    processing = false;
    to_borrow_books = [];
    borrower = null;

    setTimeout(() => {
      replace('/transact/borrow').then(() => {
        window.location.reload();
      });
    }, 2000)
  };

  let need_borrower = true;
  const pressEnterKeyEvent = new KeyboardEvent("keyup", {
    key: "Enter", // Key value for Enter key
    code: "Enter", // Key code for Enter key
    keyCode: 13, // Deprecated but still widely used
    charCode: 13, // Deprecated but still widely used
    which: 13, // Deprecated but still widely used
    bubbles: true, // Whether the event bubbles up through the DOM
    cancelable: true, // Whether the event is cancelable
  });

  onMount(async () => {
    let setting = await settingService.getOne("property", "borrow_duration");
    borrow_duration = parseInt(setting.value);

    let parsed = parse($querystring);

    if (parsed?.queue_number) {
      let queueTextbox = document.getElementById(`queuing`);
      if (queueTextbox) {
        // @ts-ignore
        queueTextbox.value = parsed.queue_number;
        queueTextbox.dispatchEvent(pressEnterKeyEvent);
        replace('#/transact/borrow');
      }
    }
  });

  const inputCardNumber = (card_number) => {
    let cardNumberInput = document.getElementById('card_number');
    // @ts-ignore
    cardNumberInput.value = card_number;
    cardNumberInput.dispatchEvent(pressEnterKeyEvent);
  }

  let hiddenDrawer;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn
  };
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
                  <span class="font-semibold text-lg uppercase"
                    >{borrower.last_name}
                    {borrower.first_name} - {borrower.card_number} ({borrower.type})</span
                  >
                {/if}
              </div>
            </Label>
            <Label 
              class="mx-2 w-full"
            >
              <span class="block mb-2">Queue number:</span>
              <Input
                disabled={processing}
                id="queuing"
                on:click={() => { hiddenDrawer = false; }}
                placeholder="Enter or scan queue number."
                on:keyup={handleQueuingKeyup}
              />
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
                id="card_number"
                placeholder="Enter or scan student/card number"
              />
            </Label>
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
            <TableHeadCell>ISBN / title</TableHeadCell>
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
                <TableBodyCell
                  >{to_borrow.book_copy?.barcode ?? ""}</TableBodyCell
                >
                <TableBodyCell title={to_borrow.book.title} class="overflow-hidden text-ellipsis" style="max-width: 200px;">
                  <span class="text-xs text-gray-500">ISBN: {to_borrow.book.isbn}</span><br>
                  {to_borrow.book.title}                
                </TableBodyCell>
                <TableBodyCell>{to_borrow.book.publication_year}</TableBodyCell>
                <TableBodyCell>{to_borrow.book.publisher}</TableBodyCell>
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
          <Button disabled={processing} on:click={processBorrowedBooks}>
            {#if processing}<Spinner size={4} class="me-2" />{/if}
            Process Books to Borrow
          </Button>
        </Card>
      {/if}
    </div>
  </main>

  <Drawer activateClickOutside={false} backdrop={false} transitionType="fly" {transitionParams} bind:hidden={hiddenDrawer}>
    <div class="flex items-center">
      <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
        <InfoCircleSolid class="w-5 h-5 me-2.5" />Reserved Books
      </h5>
      <CloseButton on:click={() => (hiddenDrawer = true)} class="mb-4 dark:text-white" />
    </div>
    <div class="w-full">
      <Table striped={true}>
        <TableHead>
          <TableHeadCell class="text-center p-0" style="width: 40px;">
            <CheckCircleOutline size="lg" class="inline-block"/>
          </TableHeadCell>
          <TableHeadCell>ISBN / BOOK TITLE</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each reserved_books as book}
            <TableBodyRow>
              <TableBodyCell class="text-center p-0" style="width: 40px;">
                {#if to_borrow_books.filter(to_borrow => to_borrow.book.id == book.id).length}
                  <CheckOutline size="lg" color="green" class="inline-block" />
                {/if}
              </TableBodyCell>
              <TableBodyCell class="text-wrap">
                <span class="text-gray-500">ISBN: {book.isbn}</span><br>
                {book.title}
              </TableBodyCell>
            </TableBodyRow>          
          {:else}
            <TableBodyRow>
              <TableBodyCell colspan={2} class="text-center">No books found.</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </Drawer>

  {#if message}
    <MessageModal open={true} {message} on:close={handleMessageClose} />
  {/if}

  {#if need_borrower}
    <BarcodeTextModal 
      on:card-scan={({detail}) => { inputCardNumber(detail); }}
      on:close={() => (need_borrower = false)} 
    />
  {/if}
</Layout>
