<script>
  import { Button, Heading, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import UserService from '../services/UserService';
  import ReportService from '../services/ReportService';
  import WishlistService from '../services/WishlistService';
  import { onMount } from "svelte";
  import { replace, querystring } from "svelte-spa-router";
  import { parse } from "qs";
  import SettingService from "../services/SettingService";
  import { PlusOutline } from "flowbite-svelte-icons";
  import ConfirmationPopup from "../components/ConfirmationPopup.svelte";
  import MemberService from "../services/MemberService";
  import MessageModal from "../components/MessageModal.svelte";
  import { format } from "date-fns";

  let crumbs = [
    {
      href: "#/student/search",
      title: "Search books",
    },    
  ];
  let userService = new UserService();
  let settingService = new SettingService();
  let reportService = new ReportService();
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

  const addToWishlist = async () => {
    let formData = new FormData();
    formData.set('book_id', selectedBook.id);
    formData.set('member_id', member.id);
    formData.set('wished_date', format(new Date(), 'yyyy-MM-dd'));

    processing = true;
    try {
      await wishlistService.add(formData)
      selectedBook = null;

      setTimeout(async () => {
        closePopup();
        message = {
          text: 'Successfully added book to wishlist.',
          type: 'success',
        }
      }, 100);
    } catch (e) {
      processing = false;
      message = {
        text: `Error: ${e.message}`,
        type: 'error',
      }
    }
  }

  const confirmWish = (item) => {
    showConfirmation = true;
    selectedBook = item;
  };

  const cancelWish = () => {
    showConfirmation = false;
    selectedBook = null;
  };

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.genre.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  })

  let books_to_retain;
  let user, member;
  onMount(async () => {
    try {
      user = await userService.me();
    } catch (e) {
      alert(e.message);
      replace("/sign-in");
    }

    member = await memberService.getOne('user_id', user.id);
    asyncItems = reportService.booksInventory();
    items = await asyncItems;
    let setting = await settingService.getOne("property", "books_to_retain");
    books_to_retain = parseInt(setting.value);

    let parsed = parse($querystring);

    if (parsed?.query) {
      searchTerm = parsed.query;
      replace('#/user/search');
    }
  });
</script>

<div class="flex flex-col">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col">
    <Heading tag="h4" class="text-center font-semibold mb-4">Search books</Heading>
    <div class="flex flex-col">
      <TableSearch
        placeholder="Search book details"
        hoverable={true}
        striped={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>ISBN / BOOK</TableHeadCell>
          <TableHeadCell class="text-center">Available</TableHeadCell>
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
                {item.available}<br>
                {#if item.available <= books_to_retain}
                  <Button outline size="xs" class="mt-1"
                    on:click={() => confirmWish(item)}
                  >
                    <PlusOutline size="xs" class="me-1" />
                    Wishlist
                  </Button>
                {/if}
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
  on:proceed={() => addToWishlist()}
  on:cancel={() => cancelWish()}
  message={`Add this book to wishlist?`}
  bind:open={showConfirmation}
/>

{#if message} 
  <MessageModal open={true} {message} on:close={handleMessageClose} />
{/if}