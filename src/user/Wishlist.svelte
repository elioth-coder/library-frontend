<script>
  import { Button, Heading, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import UserService from '../services/UserService';
  import ReportService from '../services/ReportService';
  import WishlistService from '../services/WishlistService';
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import SettingService from "../services/SettingService";
  import { PlusOutline, TrashBinOutline } from "flowbite-svelte-icons";
  import ConfirmationPopup from "../components/ConfirmationPopup.svelte";
  import MemberService from "../services/MemberService";
  import MessageModal from "../components/MessageModal.svelte";
  import { format } from "date-fns";
  import BookService from "../services/BookService";

  let crumbs = [
    {
      href: "#/student/search",
      title: "Search books",
    },    
  ];
  let userService = new UserService();
  let bookService = new BookService();
  let wishlistService = new WishlistService();
  let memberService = new MemberService();
  let hideDrawer = true;
  let message = null;

  let items = [];
  let asyncItems;
  let processing = false;
  let showConfirmation = false;
  let selectedBook = null;

  const handleMessageClose = () => {
    message = null;
  }

  const closePopup = () => {
    showConfirmation = false;
    processing = false;
  };

  const deleteFromWishlist = async () => {

    processing = true;
    try {
      await wishlistService.delete(selectedBook.wish_id);
      selectedBook = null;

      setTimeout(async () => {
        closePopup();
        message = {
          text: 'Successfully deleted book from wishlist.',
          type: 'success',
        }
        asyncItems = getBooksOnWishlist(member.id);
        items = await asyncItems;
      }, 100);
    } catch (e) {
      processing = false;
      message = {
        text: `Error: ${e.message}`,
        type: 'error',
      }
    }
  }

  const confirmDelete = (item) => {
    showConfirmation = true;
    selectedBook = item;
  };

  const cancelDelete = () => {
    showConfirmation = false;
    selectedBook = null;
  };

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.genre.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  })

  const getBooksOnWishlist = async (member_id) => {
    let wishedItems = await wishlistService.getBy('member_id', member_id);
    let books = [];

    for(let i=0; i<wishedItems.length; i++) {
      let item = wishedItems[i];
      let book = await bookService.get(item.book_id);

      books.push({
        ...book,
        wish_id: item.id
      });
    }

    return books;
  }

  let user, member;
  onMount(async () => {
    try {
      user = await userService.me();
    } catch (e) {
      alert(e.message);
      replace("/sign-in");
    }

    member = await memberService.getOne('user_id', user.id);
    asyncItems = getBooksOnWishlist(member.id);
    items = await asyncItems;
  });
</script>

<div class="flex flex-col">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col">
    <Heading tag="h4" class="text-center font-semibold mb-4">Books on Wishlist</Heading>
    <div class="flex flex-col">
      <TableSearch
        placeholder="Search book details"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>ISBN / BOOK</TableHeadCell>
          <TableHeadCell class="text-center">Action</TableHeadCell>
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
              <TableBodyCell class="align-top" style="max-width: 270px;">
                <span class="text-gray-500">ISBN: {item.isbn}</span><br>
                <p class="overflow-hidden text-ellipsis">{item.title}</p>
                <span class="text-gray-500">Genre: {item.genre}</span><br>
              </TableBodyCell>
              <TableBodyCell class="align-top text-center">
                  <Button color="red" size="xs" class="mt-1"
                    on:click={() => confirmDelete(item)}
                  >
                    <TrashBinOutline size="xs" />
                  </Button>
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

<ConfirmationPopup
  {processing}
  on:proceed={() => deleteFromWishlist()}
  on:cancel={() => cancelDelete()}
  message={`Delete this book from wishlist?`}
  bind:open={showConfirmation}
/>

{#if message} 
  <MessageModal open={true} {message} on:close={handleMessageClose} />
{/if}