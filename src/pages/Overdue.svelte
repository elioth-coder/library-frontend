<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Heading,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import BorrowedService from "../services/BorrowedService";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import MemberService from "../services/MemberService";
  import { onMount } from "svelte";
  import { differenceInCalendarDays, differenceInDays, format } from "date-fns";

  let crumbs = [
    {
      href: "#/books",
      title: "List of Books",
    },
    {
      href: "#/books/overdue",
      title: "Borrowed",
    },
  ];
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
      item.barcode.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    }
  );

  const getBorrowedBooks = async () => {
    let borrowed_books = await borrowedService.getBorrowed();
    let books = [];

    for(let i=0; i<borrowed_books.length; i++) {
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
      }

      books.push(borrowed);
    }

    return books;
  }
  let asyncItems;

  onMount(async () => {
    asyncItems = getBorrowedBooks();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Overdue Books</Heading>
      <TableSearch
        placeholder="Search by book title"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-right">No.</TableHeadCell>
          <TableHeadCell>Barcode</TableHeadCell>
          <TableHeadCell>ISBN / Title</TableHeadCell>
          <TableHeadCell>Borrowed By</TableHeadCell>
          <TableHeadCell>Due Date</TableHeadCell>
          <TableHeadCell class="text-center">Remarks</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center">Fetching items...</TableBodyCell>
            </TableBodyRow>
          {/await}
          {#each filteredItems as item, index}
            {@const difference = differenceInCalendarDays(new Date(item.due_date), new Date())}
            {
              @const color = 
                (difference<0)  ? "red" : 
                (difference==0) ? "yellow" : "gray"
            }  
            <TableBodyRow>
              <TableBodyCell class="text-right">{index + 1}. </TableBodyCell>
              <TableBodyCell>{item.barcode}</TableBodyCell>
              <TableBodyCell title={item.title} style="max-width: 200px;" class="overflow-hidden text-ellipsis">
                <span class="text-xs text-gray-500">ISBN: {item.isbn}</span><br>
                {item.title}
              </TableBodyCell>
              <TableBodyCell>{item.borrowed_by}</TableBodyCell>
              <TableBodyCell>{item.due_date}</TableBodyCell>
              <TableBodyCell class="text-{color}-800 font-bold text-center">
                {#if difference<0}
                  Overdue 
                  {#if difference==-1} 1 day{/if}
                  {#if difference<=-2} {difference * -1} days{/if}
                {:else}
                  Due
                  {#if difference==0}today{/if}
                  {#if difference==1}in 1 day{/if}
                  {#if difference>=2}in {difference} days{/if}
                {/if}
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>
  </main>
</Layout>
