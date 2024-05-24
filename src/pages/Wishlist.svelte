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
  import WishlistService from "../services/WishlistService";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import MemberService from "../services/MemberService";
  import { onMount } from "svelte";

  let crumbs = [
    {
      href: "#/books",
      title: "List of Books",
    },
    {
      href: "#/books/wishlist",
      title: "Wishlist",
    },
  ];
  let wishlistService = new WishlistService();
  let bookService = new BookService();
  let memberService = new MemberService();
  let searchTerm = "";
  let items = [];

  $: filteredItems = items.filter(
    (item) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

  const getWishedBooks = async () => {
    let wished_books = await wishlistService.getAll();
    let books = [];

    for (let i = 0; i < wished_books.length; i++) {
      let wished_book = wished_books[i];
      let book = await bookService.get(wished_book.book_id);
      let member = await memberService.get(wished_book.member_id);

      console.log({wished_book})

      let wished = {
        title: book.title,
        wished_on: wished_book.wished_date,
        wished_by: `${member.first_name} ${member.last_name}`,
      };

      books.push(wished);
    }

    return books;
  };
  let asyncItems;

  onMount(async () => {
    asyncItems = getWishedBooks();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Books On Wishlist</Heading>
      <TableSearch
        placeholder="Search by book title"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-right">No.</TableHeadCell>
          <TableHeadCell class="text-center">Wished On</TableHeadCell>
          <TableHeadCell>Book Title</TableHeadCell>
          <TableHeadCell>Wished By</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={6} class="text-center"
                >Fetching items...</TableBodyCell
              >
            </TableBodyRow>
          {/await}
          {#each filteredItems as item, index}
            <TableBodyRow>
              <TableBodyCell class="text-right">{index + 1}.</TableBodyCell>
              <TableBodyCell class="text-center"
                >{item.wished_on}</TableBodyCell
              >
              <TableBodyCell>{item.title}</TableBodyCell>
              <TableBodyCell>{item.wished_by}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>
  </main>
</Layout>
