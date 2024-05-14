<script>
  import { Button, Heading, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
  import cart_items from "../../stores/CartItems";
  import AsyncText from "../AsyncText.svelte";
  import { TrashBinOutline } from "flowbite-svelte-icons";
  import BookService from "../../services/BookService";
  import QueueService from "../../services/QueueService";
  import ReserveService from "../../services/ReserveService";
  import { format } from "date-fns";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let openCart;
  let {HOST} = CONFIG;
  let processing = false;
  let bookService = new BookService();
  let queueService = new QueueService();
  let reserveService = new ReserveService();

  const handleReservation = async () => {
    processing = true;

    let formData = new FormData();
    formData.set('dt_created', format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
    let queue = await queueService.add(formData);

    for(let i=0; i<$cart_items.length; i++) {
      let item = $cart_items[i];

      console.log(item);
      let reserveFormData = new FormData();

      reserveFormData.set('number', queue.id);
      reserveFormData.set('book_id', item.id);
      
      await reserveService.add(reserveFormData);
    }

    $cart_items = [];
    processing = false;
    dispatch('close');
    dispatch('open-qr', queue);
  }

  const getAuthorFullName = async (book_id) => {
    let authors = await bookService.authors(book_id, 'Main Author');
    let author = authors[0];

    return author ? `${author.first_name} ${author.last_name}` : "";
  };

  const removeFromCart = (item) => {
    $cart_items = $cart_items.filter(cart_item => cart_item.id != item.id);
  }
</script>

<Modal title="Cart Items" bind:open={openCart} on:close>
  <Table>
    <TableHead>
      <TableHeadCell></TableHeadCell>
      <TableHeadCell class="align-top">Cover</TableHeadCell>
      <TableHeadCell class="align-top">Title</TableHeadCell>
      <TableHeadCell class="align-top">Genre</TableHeadCell>
      <TableHeadCell class="align-top text-center">Action</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each $cart_items as item, index}
        <TableBodyRow>
          <TableBodyCell class="align-top text-right"
            >{index + 1}.</TableBodyCell
          >
          <TableBodyCell class="text-center">
            {#if item.cover}
              <!-- svelte-ignore a11y-missing-attribute -->
              <img
                src={`${HOST}/static/uploads/${item.cover}`}
                style="width: 75px;"
              />
            {:else}
              <!-- svelte-ignore a11y-missing-attribute -->
              <img
                src={`${HOST}/static/uploads/book_cover.png`}
                style="width: 75px;"
              />
            {/if}
          </TableBodyCell>
          <TableBodyCell class="align-top">
            <Heading tag="h6">{item.title}</Heading>
            <span class="font-thin"
              >by: <AsyncText
                classes="text-sm font-normal"
                promise={getAuthorFullName(item.id)}
              /></span
            >
            <br />
            <span class="font-thin">Published: {item.publication_year}</span>
          </TableBodyCell>
          <TableBodyCell class="align-top text-center"
            >{item.genre}</TableBodyCell
          >
          <TableBodyCell class="align-top text-center">
            <Button outline on:click={() => removeFromCart(item)}>
              <TrashBinOutline />
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell class="text-center" colspan="5"
            >No items found.</TableBodyCell
          >
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <svelte:fragment slot="footer">
    {#if $cart_items.length}
      <Button on:click={handleReservation}>Reserve</Button>
    {/if}
    <Button on:click={() => (openCart = false)} color="alternative"
      >Close</Button
    >
  </svelte:fragment>
</Modal>
