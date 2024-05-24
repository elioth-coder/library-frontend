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

  let crumbs = [
    {
      href: "#/reports",
      title: "Reports",
    },
    {
      href: "#/books_inventory",
      title: "Available Books",
    },
  ];
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let items = [];
  let asyncItems;

  const getAvailableBooks = async () => {
    let copies = await bookCopyService.getBy('status', 'Available');
    let availableBooks = [];

    for(let i=0; i<copies.length; i++) {
      let copy = copies[i];
      let book = await bookService.get(copy.book_id);
      let availableBook = {
        barcode: copy.barcode,
        isbn: book.isbn,
        title: book.title,
        genre: book.genre,
      }

      availableBooks.push(availableBook);
    }

    return sortBy(availableBooks, (book) => book.title);
  };

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.barcode.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.genre.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
  })

  onMount(async () => {
    asyncItems = getAvailableBooks();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4">List of Available Books</Heading>
      <TableSearch 
        hoverable={true}
        placeholder="Search book details"
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-center">Barcode</TableHeadCell>
          <TableHeadCell class="text-center">ISBN</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Genre</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={4} class="text-center"
                >Generating report...</TableBodyCell
              >
            </TableBodyRow>
          {/await}
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell class="text-center">{item.barcode}</TableBodyCell>
              <TableBodyCell class="text-center">{item.isbn}</TableBodyCell>
              <TableBodyCell>{item.title}</TableBodyCell>
              <TableBodyCell>{item.genre}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
        {#if items}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" colspan={3} class="py-3 px-6 text-base">
                Total Available Books
                {items.length}
              </th>
            </tr>
          </tfoot>
        {/if}
      </TableSearch>
    </div>
  </main>
</Layout>
