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
  import { differenceInCalendarDays } from "date-fns";

  let crumbs = [
    {
      href: "#/reports",
      title: "Reports",
    },
    {
      href: "#/books_inventory",
      title: "Returned Books",
    },
  ];
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let memberService = new MemberService();
  let borrowedService = new BorrowedService();
  let items = [];
  let asyncItems;

  let decimal = Intl.NumberFormat('en-PH', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  const getReturnedBooks = async () => {
    let borrowed_books = await borrowedService.getReturned();
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
        returned_date: borrowed_book.returned_date,
        borrowed_date: borrowed_book.borrowed_date,
        due_date: borrowed_book.due_date,
        penalty: borrowed_book.penalty,
        borrowed_by: `${borrower.first_name} ${borrower.last_name}`,
        borrower_type: borrower.type,
        course_year: (borrower.type=='Student') ? `${borrower.course} - ${borrower.year_level}` : '',
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
    asyncItems = getReturnedBooks();
    items = await asyncItems;
    items = items.filter(item => item.penalty > 0)
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4"
        >List of Collected Penalty Fees</Heading
      >
      <TableSearch
        hoverable={true}
        placeholder="Search book details"
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-center">Barcode</TableHeadCell>
          <TableHeadCell>Book Title</TableHeadCell>
          <TableHeadCell>Borrowed By</TableHeadCell>
          <TableHeadCell>Returned On</TableHeadCell>
          <TableHeadCell class="text-right">Penalty Fee</TableHeadCell>
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
            {@const difference = differenceInCalendarDays(new Date(item.due_date), new Date(item.returned_date))}
            <TableBodyRow>
              <TableBodyCell class="align-top text-center">{item.barcode}</TableBodyCell>
              <TableBodyCell class="align-top overflow-hidden text-ellipsis" style="max-width: 230px;">
                <span class="text-gray-500">ISBN: {item.isbn}</span><br />
                {item.title}
              </TableBodyCell>
              <TableBodyCell class="align-top">
                {item.borrowed_by}<br>
                <span class="text-gray-500">
                  {(item.borrower_type=='Student') 
                    ? item.course_year 
                    : `(${item.borrower_type})`
                  }
                </span>              
              </TableBodyCell>
              <TableBodyCell class="align-top">
                {item.returned_date}<br>
                <span class="text-red-500">
                  Returned {difference * -1} days late
                </span>
              </TableBodyCell>
              <TableBodyCell class="align-top text-right">
                {#if item.penalty}
                  {decimal.format(item.penalty)}
                {:else}
                  N/A
                {/if}
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
        {#if filteredItems}
          {@const totalFees = items.reduce((prev, current)=> prev += current.penalty, 0)}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" colspan={4} class="py-3 px-6 text-base text-right">
                Total Collected Penalty Fees:
              </th>
              <th class="text-right p-6 text-base">{decimal.format(totalFees)}</th>
            </tr>
          </tfoot>
        {/if}
      </TableSearch>
    </div>
  </main>
</Layout>
