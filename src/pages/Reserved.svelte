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
  import ReserveService from "../services/ReserveService";
  import BookService from "../services/BookService";
  import { onMount } from "svelte";
  import QueueService from "../services/QueueService";
  import { sortBy } from "lodash-es";

  let crumbs = [
    {
      href: "#/books",
      title: "List of Books",
    },
    {
      href: "#/books/reserved",
      title: "Reserved",
    },
  ];
  let reserveService = new ReserveService();
  let bookService = new BookService();
  let queueService = new QueueService();
  let searchTerm = "";
  let items = [];
  let asyncItems;

  $: filteredItems = items.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.number.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    });

  const getReservedBooks = async () => {
    let reserved_books = await reserveService.getAll();
    let books = [];

    for (let i = 0; i < reserved_books.length; i++) {
      let reserved_book = reserved_books[i];
      let book  = await bookService.get(reserved_book.book_id);
      let queue = await queueService.get(reserved_book.number)

      let reserved = {
        title: book.title,
        number: reserved_book.number + "",
        dt_reserved: queue.dt_created,
      };

      books.push(reserved);
    }

    return sortBy(books, (book) => parseInt(book.number));
  }

  onMount(async () => {
    asyncItems = getReservedBooks();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Books On Reserve</Heading>
      <TableSearch
        placeholder="Search book."
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-right">No.</TableHeadCell>
          <TableHeadCell>Reserved On</TableHeadCell>
          <TableHeadCell>Book Title</TableHeadCell>
          <TableHeadCell class="text-center">Queue No.</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={4} class="text-center">Fetching items...</TableBodyCell>
            </TableBodyRow>
          {/await}
          {#each filteredItems as item, index}
            <TableBodyRow>
              <TableBodyCell class="text-right">{index + 1}.</TableBodyCell>
              <TableBodyCell>{item.dt_reserved}</TableBodyCell>
              <TableBodyCell>{item.title}</TableBodyCell>
              <TableBodyCell class="text-center">{item.number}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>
  </main>
</Layout>
