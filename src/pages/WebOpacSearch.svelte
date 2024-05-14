<script>
// @ts-nocheck
  import "../app.pcss";
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import Header from "../components/web_opac/Header.svelte";
  import Sidebar from "../components/web_opac/Sidebar.svelte";
  import Footer from "../components/web_opac/Footer.svelte";
  import SearchForm from "../components/web_opac/SearchForm.svelte";
  import AsyncText from "../components/AsyncText.svelte";
  import { querystring } from "svelte-spa-router";
  import qs from "qs";
  import { Modal, Button, Table, TableBody, TableHead, TableHeadCell, TableBodyRow, TableBodyCell, Label, Select, Card, Banner, Heading, Listgroup, ListgroupItem, P, Hr } from "flowbite-svelte";
  import BookService from "../services/BookService";
  import BookCopyService from "../services/BookCopyService";
  import { PlusOutline, TrashBinOutline } from "flowbite-svelte-icons";
  import CartItemsModal from "../components/web_opac/CartItemsModal.svelte";
  import QrModal from "../components/web_opac/QrModal.svelte";
  import cart_items from '../stores/CartItems';

  let userService = new UserService();
  let bookService = new BookService();
  let bookCopyService = new BookCopyService();
  let user;
  let openCart = false;
  let openQR = false;
  let queueNumber;
  let queryText, items;
  let { HOST } = CONFIG;

  onMount(async () => {
    try {
      user = await userService.me();
    } catch (e) {}
  });

  const addToCart = (item) => {
    $cart_items = [ ...$cart_items, item];
  }

  const removeFromCart = (item) => {
    $cart_items = $cart_items.filter(cart_item => cart_item.id != item.id);
  }

  const search = async (query) => {
    queryText = query
    items = await bookService.search(query);

    for(let i=0; i<items.length; i++) {
      items[i].count = bookCopyService.copiesCount(items[i].id, 'Available');
    }
  }

  const getAuthorFullName = async (book_id) => {
    let authors = await bookService.authors(book_id, 'Main Author');
    let author = authors[0];

    return author ? `${author.first_name} ${author.last_name}` : "";
  };

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
</script>

<QrModal 
  {openQR}
  {queueNumber}
  on:close={() => openQR = false} 
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
              <TableBodyCell class="align-top">
                <Heading tag="h6">{item.title}</Heading>
                <span class="font-thin">by: <AsyncText classes="text-sm font-normal" promise={getAuthorFullName(item.id)} /></span>
                <br>
                <span class="font-thin">Published: {item.publication_year}</span>
              </TableBodyCell>
              <TableBodyCell class="align-top text-center">{item.genre}</TableBodyCell>
              <TableBodyCell class="align-top text-center">
                {#await item.count}
                  <span>Loading...</span>
                {:then count}
                  <span>{count}</span><br><br>
                  {#if count}
                    {#if $cart_items.filter(cart_item => cart_item.id == item.id).length == 0}
                      <Button style="width: 130px;" size="xs" outline on:click={() => addToCart(item)}>
                        <PlusOutline class="w-4 h-4 me-1" />
                        Add to Cart
                      </Button>
                    {:else}
                      <Button style="width: 130px;" size="xs" outline on:click={() => removeFromCart(item)}>
                        Remove from Cart
                      </Button>
                    {/if}
                  {/if}
                {/await}
              </TableBodyCell>
              <TableBodyCell class="text-center">
                {#if item.cover}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src={`${HOST}/static/uploads/${item.cover}`} style="width: 75px;" />
                {:else}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src={`${HOST}/static/uploads/book_cover.png`} style="width: 75px;" />
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
