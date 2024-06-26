<script>
// @ts-nocheck
  import "../app.pcss";
  import { onMount } from "svelte";
  import SettingService from "../services/SettingService";
  import Header from "../components/queuing/Header.svelte";
  import Sidebar from "../components/queuing/Sidebar.svelte";
  import Footer from "../components/queuing/Footer.svelte";
  import SearchForm from "../components/queuing/SearchForm.svelte";
  import { querystring } from "svelte-spa-router";
  import qs from "qs";
  import { Button, Table, TableBody, TableHead, TableHeadCell, TableBodyRow, TableBodyCell, Label, Select, Card, Banner, Heading, Listgroup, ListgroupItem, P, Hr } from "flowbite-svelte";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import { PlusOutline } from "flowbite-svelte-icons";
  import CartItemsModal from "../components/queuing/CartItemsModal.svelte";
  import QrModal from "../components/queuing/QrModal.svelte";
  import cart_items from '../stores/CartItemsStore';
  import ReserveService from "../services/ReserveService";

  let settingService = new SettingService();
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let reserveService = new ReserveService();
  let openCart = false;
  let openQR = false;
  let queueNumber;
  let queryText, items;
  let { HOST } = CONFIG;

  const addToCart = (item) => {
    $cart_items = [ ...$cart_items, item];
  }

  const removeFromCart = (item) => {
    $cart_items = $cart_items.filter(cart_item => cart_item.id != item.id);
  }

  const availableCount = async (book_id) => {
    let copiesCount = await bookCopyService.copiesCount(book_id, 'Available');
    let reservedCount = await reserveService.countBy('book_id', book_id);

    return copiesCount - reservedCount;
  }

  const search = async (query) => {
    queryText = query
    items = await bookService.search(query);

    for(let i=0; i<items.length; i++) {
      let book_id = items[i].id;
      items[i].count = availableCount(book_id);
    }
  }

  const handleQR = (e) => {
    let queue = e.detail;

    queueNumber = queue.id + '';

    console.log({queue, queueNumber});
    openQR = true;
  }

  $: {
    let { query, type } = qs.parse($querystring);
    search(query);
  }

  let campus, borrow_duration, location, penalty_per_day, books_to_retain;
  
  onMount(async () => {
    let settingItems = await settingService.getAll();
    let settings = {};

    for(let i=0; i<settingItems.length; i++) {
      let item = settingItems[i];

      settings[item.property] = item.value;
    }
    
    campus = settings.campus ?? "";
    borrow_duration = settings.borrow_duration ?? "";
    location = settings.location ?? "";
    penalty_per_day = settings.penalty_per_day ?? "";
    books_to_retain = parseInt(settings.books_to_retain ?? "");

    console.log({books_to_retain});
  });

  const handleQRModalClose = () => {
    openQR = false;
    window.location.reload();
  }
</script>

<QrModal 
  {openQR}
  {queueNumber}
  on:close={handleQRModalClose} 
/>

<CartItemsModal 
  {openCart} 
  on:close={() => openCart = false} 
  on:open-qr={handleQR}
/>

<Header 
  on:open-cart={() => openCart = true} 
/>
<div class="flex flex-col">
  <div class="w-full mx-auto max-w-screen-lg">
    <section class="max-w-screen-md flex w-2/3 py-5">
      <SearchForm />
    </section>
  </div>
  <Banner id="default-banner" position="relative">
    <div class="max-w-screen-lg min-w-full">
      <P>Search results - {queryText ?? ""}</P>
    </div>
  </Banner>
  <div class="max-w-screen-lg mx-auto w-full flex">
    <Sidebar />
    <section class="w-full min-h-96 p-3">
      {#if items}
      <Table>
        <TableHead>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell class="align-top">Title</TableHeadCell>
          <TableHeadCell class="align-top">Genre</TableHeadCell>
          <TableHeadCell class="align-top text-center">Available Copies</TableHeadCell>
          <TableHeadCell class="align-top">Cover</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each items as item, index}
            <TableBodyRow>
              <TableBodyCell class="align-top text-right">{index + 1}.</TableBodyCell>
              <TableBodyCell title={item.title} class="align-top" style="max-width: 310px;">
                <Heading tag="h6" class="overflow-hidden text-ellipsis w-full">{item.title}</Heading>
                <span class="font-thin">{item.author}</span>
                <br>
                <span class="font-thin">Published: {item.publication_year}</span>
              </TableBodyCell>
              <TableBodyCell class="align-top text-center">{item.genre}</TableBodyCell>
              <TableBodyCell class="align-top text-center">
                {#await item.count}
                  <span>Loading...</span>
                {:then count}
                  {#if count > books_to_retain}
                    {#if $cart_items?.filter(cart_item => cart_item.id == item.id).length == 0}
                      <span>{count}</span><br><br>
                      <Button color="green" style="width: 130px;" size="xs" outline on:click={() => addToCart(item)}>
                        <PlusOutline class="w-4 h-4 me-1" />
                        Add to Cart
                      </Button>
                    {:else}
                      <span>{count - 1}</span><br><br>
                      <Button color="red" style="width: 130px;" size="xs" outline on:click={() => removeFromCart(item)}>
                        Remove from Cart
                      </Button>
                    {/if}
                  {:else}
                    <span>{count}</span><br><br>
                  {/if}
                {/await}
              </TableBodyCell>
              <TableBodyCell class="text-center">
                {#if item.cover}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src={`${HOST}/static/uploads/${item.cover}`} style="height: 70px;" />
                {:else}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src={`${HOST}/static/uploads/book_cover.png`} style="height: 70px;" />
                {/if}  
              </TableBodyCell>
            </TableBodyRow>
          {:else}
            <TableBodyRow>
              <TableBodyCell class="text-center" colspan="5">No items found.</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
      {/if}
    </section>
  </div>
</div>
<Footer />
