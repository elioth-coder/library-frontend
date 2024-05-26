<script>
  import { Heading, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
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

  let decimal = Intl.NumberFormat('en-PH', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  let hideDrawer = true;
  
  let crumbs = [
    {
      href: "#/student/returned",
      title: "Returned",
    },
  ];

  let userService = new UserService();
  let borrowedService = new BorrowedService();
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let memberService = new MemberService();
  let searchTerm = "";
  let items = [];

  $: filteredItems = items.filter(
    (item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        (item.penalty + '').toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    }
  );

  const getBorrowedBooks = async () => {
    let user = await userService.me();
    let member = await memberService.getOne('user_id', user.id);
    let borrowed_books = await borrowedService.getReturnedBy(member.id)
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
        returned_date: borrowed_book.returned_date,
        penalty: borrowed_book.penalty,
      };

      books.push(borrowed);
    }

    return books;
  };

  let asyncItems;

  onMount(async () => {
    let user = await userService.me();

    if(user.role == 'Admin') {
      replace('#/');
    }
    asyncItems = getBorrowedBooks();
    items = await asyncItems;
  })
</script>

<div class="flex flex-col">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col">
    <Heading tag="h4" class="text-center font-semibold mb-4">Returned Books</Heading>
    <div class="flex flex-col">
      <TableSearch
        placeholder="Search book details"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>BOOKS BORROWED</TableHeadCell>
          <TableHeadCell>RETURNED DATE</TableHeadCell>
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
            <TableBodyRow>
              <TableBodyCell class="align-top" style="max-width: 250px;">
                <span class="text-gray-500">ISBN: {item.isbn}</span><br>
                <p class="overflow-hidden text-ellipsis">{item.title}</p>
                <span class="text-gray-500">Borrowed On: {item.borrowed_date}</span><br>
              </TableBodyCell>
              <TableBodyCell class="align-top">
                {item.returned_date}<br />
                {#if item.penalty}
                  <strong>Fee:
                    {decimal.format(item.penalty)}
                  </strong><br>
                  <span class="text-red-400">Due to late return</span>
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
  </main>
</div>