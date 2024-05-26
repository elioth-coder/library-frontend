<script>
  import { Alert, Heading, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import { onMount } from "svelte";
  import MemberService from "../services/MemberService";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import BorrowedService from "../services/BorrowedService";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import SettingService from "../services/SettingService";
  import { differenceInCalendarDays } from "date-fns";
  import { InfoCircleSolid } from "flowbite-svelte-icons";

  let hideDrawer = true;
  let decimal = Intl.NumberFormat('en-PH', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  let crumbs = [
    {
      href: "#/student/borrowed",
      title: "Borrowed",
    },
  ];

  let userService = new UserService();
  let borrowedService = new BorrowedService();
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let settingService = new SettingService();
  let memberService = new MemberService();
  let searchTerm = "";
  let items = [];

  $: filteredItems = items.filter(
    (item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.due_date.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    }
  );

  const getBorrowedBooks = async () => {
    let user = await userService.me();
    let member = await memberService.getOne('user_id', user.id);
    let borrowed_books = await borrowedService.getBorrowedBy(member.id)
    let books = [];

    for (let i = 0; i < borrowed_books.length; i++) {
      let borrowed_book = borrowed_books[i];
      let book_copy = await bookCopyService.get(borrowed_book.book_copy_id);
      let book = await bookService.get(book_copy.book_id);
      let borrower = await memberService.get(borrowed_book.member_id);

      let borrowed = {
        barcode: book_copy.barcode,
        isbn: book.isbn,
        title: book.title,
        borrowed_date: borrowed_book.borrowed_date,
        due_date: borrowed_book.due_date,
        borrowed_by: `${borrower.first_name} ${borrower.last_name}`,
      };

      books.push(borrowed);
    }

    return books;
  };

  let asyncItems, penalty_per_day;

  onMount(async () => {
    let user = await userService.me();

    if(user.role == 'Admin') {
      replace('#/');
    }
    asyncItems = getBorrowedBooks();
    items = await asyncItems;
    let setting = await settingService.getOne("property", "penalty_per_day");
    penalty_per_day = parseFloat(setting.value);
  })
</script>

<div class="flex flex-col">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col">
    <Heading tag="h4" class="text-center font-semibold mb-4">Borrowed Books</Heading>
    <div class="flex flex-col">
      <TableSearch
        placeholder="Search book details"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>ISBN / BOOK</TableHeadCell>
          <TableHeadCell>Due Date</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={2} class="text-center">
                Fetching items...
              </TableBodyCell>
            </TableBodyRow>
          {/await}
          {#each filteredItems as item}
            {@const difference = differenceInCalendarDays(
              new Date(item.due_date),
              new Date()
            )}
            <TableBodyRow>
              <TableBodyCell style="max-width: 250px;">
                <span class="text-gray-500">ISBN: {item.isbn}</span><br>
                <p class="overflow-hidden text-ellipsis">{item.title}</p>
              </TableBodyCell>
              <TableBodyCell>
                {item.due_date}<br />
                {#if difference < 0}
                  <strong class="text-red-600">
                    Overdue
                    {difference * -1}
                    day{((difference * -1) > 1) ? "s" : ""}
                  </strong><br>
                  <strong>Penalty: </strong>{decimal.format(difference * penalty_per_day * -1)}
                {:else}
                  <strong class="text-yellow-600">
                    Due
                    {#if difference == 0}today{/if}
                    {#if difference == 1}in 1 day{/if}
                    {#if difference >= 2}in {difference} days{/if}
                  </strong>
                {/if}
              </TableBodyCell>
            </TableBodyRow>
          {:else}
            <TableBodyRow>
              <TableBodyCell colspan={2} class="text-center">
                No books found.
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>
    <section class="p-5">
      <Alert border color="yellow">
        <InfoCircleSolid slot="icon" class="w-5 h-5" />
        <span class="font-medium">Note: </span>
        The penalty per day for late return of books is {decimal.format(penalty_per_day)}
      </Alert>
    </section>
  </main>
</div>