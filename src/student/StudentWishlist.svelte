<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Button,
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
  import UserService from "../services/UserService";
  import { TrashBinOutline } from "flowbite-svelte-icons";
  import ConfirmationPopup from "../components/ConfirmationPopup.svelte";
  import Toast from "../components/Toast.svelte";

  let crumbs = [
    {
      href: "#/student/wished",
      title: "Borrowed",
    },
  ];
  let userService = new UserService();
  let wishlistService = new WishlistService();
  let bookService = new BookService();
  let memberService = new MemberService();
  let searchTerm = "";
  let items = [];
  let showConfirmation = false;
  let selectedItem = null;
  let notification = null;
  let processing = false;

  const confirmDelete = (item) => {
    showConfirmation = true;
    selectedItem = item;
  };

  const cancelDelete = () => {
    showConfirmation = false;
    selectedItem = null;
  };
  
  $: filteredItems = items.filter(
    (item) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

  const getWishedBooks = async () => {
    let user = await userService.me();
    let member = await memberService.getOne("user_id", user.id);
    let wished_books = await wishlistService.getBy("member_id", member.id);
    let books = [];

    for (let i = 0; i < wished_books.length; i++) {
      let wished_book = wished_books[i];
      let book = await bookService.get(wished_book.book_id);
      let wisher = await memberService.get(wished_book.member_id);

      let wished = {
        id: wished_book.id,
        isbn: book.isbn,
        title: book.title,
        wished_date: wished_book.wished_date,
        wished_by: `${wisher.first_name} ${wisher.last_name}`,
      };

      books.push(wished);
    }

    return books;
  };
  let asyncItems;

  onMount(() => {
    refreshItems();
  });

  const refreshItems = async () => {
    asyncItems = getWishedBooks();
    items = await asyncItems;
  }

  const deleteItem = async () => {
    processing = true;
    try {
      await wishlistService.delete(selectedItem.id);
      selectedItem = null;

      setTimeout(async () => {
        closePopup();
        notification = {
          position: "top-right",
          status: "success",
          message: `Successfully deleted the book on wishlist.`,
        };
        refreshItems();
      }, 100);
    } catch (e) {
      processing = false;
      notification = {
        position: "top-right",
        status: "error",
        message: e.message,
      };
    }
  };

  const closePopup = () => {
    showConfirmation = false;
    processing = false;
  };
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
          <TableHeadCell class="text-center">ISBN</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Wished Date</TableHeadCell>
          <TableHeadCell class="text-center">Action</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={5} class="text-center">
                Fetching items...
              </TableBodyCell>
            </TableBodyRow>
          {/await}
          {#each filteredItems as item, index}
            <TableBodyRow>
              <TableBodyCell class="text-right">{index + 1}.</TableBodyCell>
              <TableBodyCell class="text-center">{item.isbn}</TableBodyCell>
              <TableBodyCell>{item.title}</TableBodyCell>
              <TableBodyCell>{item.wished_date}</TableBodyCell>
              <TableBodyCell class="text-center">
                <Button 
                  on:click={() => confirmDelete(item)}
                  color="red" size="xs"
                >
                  <TrashBinOutline />
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>

      <ConfirmationPopup
        {processing}
        on:proceed={() => deleteItem()}
        on:cancel={() => cancelDelete()}
        message={`Delete this book from wishlist?`}
        bind:open={showConfirmation}
      />

      {#if notification !== null}
        <Toast {...notification} on:close={() => (notification = null)} />
      {/if}
    </div>
  </main>
</Layout>
