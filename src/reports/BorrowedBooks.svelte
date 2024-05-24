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
  import { onMount } from "svelte";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import { sortBy } from "lodash-es";
  import MemberService from "../services/MemberService";
  import BorrowedService from "../services/BorrowedService";

  let crumbs = [
    {
      href: "#/reports",
      title: "Reports",
    },
    {
      href: "#/books_inventory",
      title: "Borrowed Books",
    },
  ];
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let memberService = new MemberService();
  let borrowedService = new BorrowedService();
  let items = [];
  let asyncItems;

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
        genre: book.genre,
        borrowed_date: borrowed_book.borrowed_date,
        due_date: borrowed_book.due_date,
        borrowed_by: `${borrower.first_name} ${borrower.last_name}`,
      }

      books.push(borrowed);
    }

    return sortBy(books, (book) => book.title);
  }

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.barcode.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.genre.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
  });

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
      <Heading tag="h4" class="text-center mb-4"
        >List of Borrowed Books</Heading
      >
      <TableSearch
        hoverable={true}
        placeholder="Search book details"
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-center">Barcode</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Borrowed By</TableHeadCell>
          <TableHeadCell>Borrowed On</TableHeadCell>
          <TableHeadCell>Due Date</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={5} class="text-center"
                >Generating report...</TableBodyCell
              >
            </TableBodyRow>
          {/await}
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell class="text-center">{item.barcode}</TableBodyCell>
              <TableBodyCell>{item.title}</TableBodyCell>
              <TableBodyCell>{item.borrowed_by}</TableBodyCell>
              <TableBodyCell>{item.borrowed_date}</TableBodyCell>
              <TableBodyCell>{item.due_date}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
        {#if items}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" colspan={3} class="py-3 px-6 text-base">
                Total Borrowed Books
                {items.length}
              </th>
            </tr>
          </tfoot>
        {/if}
      </TableSearch>
    </div>
  </main>
</Layout>
