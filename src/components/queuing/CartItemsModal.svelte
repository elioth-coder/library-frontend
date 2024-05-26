<script>
  import {
    Button,
    Heading,
    Modal,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import cart_items from "../../stores/CartItemsStore";
  import AsyncText from "../AsyncText.svelte";
  import { TrashBinOutline } from "flowbite-svelte-icons";
  import BookService from "../../services/BookService";
  import QueueService from "../../services/QueueService";
  import ReserveService from "../../services/ReserveService";
  import { format } from "date-fns";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let openCart;
  let { HOST } = CONFIG;
  let processing = false;
  let bookService = new BookService();
  let queueService = new QueueService();
  let reserveService = new ReserveService();

  const handleReservation = async () => {
    processing = true;

    let formData = new FormData();
    formData.set("dt_created", format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    let queue = await queueService.add(formData);

    for (let i = 0; i < $cart_items.length; i++) {
      let item = $cart_items[i];

      console.log(item);
      let reserveFormData = new FormData();

      reserveFormData.set("number", queue.id);
      reserveFormData.set("book_id", item.id);

      await reserveService.add(reserveFormData);
    }

    $cart_items = [];
    processing = false;
    dispatch("close");
    dispatch("open-qr", queue);
  };

  const removeFromCart = (item) => {
    $cart_items = $cart_items.filter((cart_item) => cart_item.id != item.id);
  };
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
                style="height: 60px;"
              />
            {/if}
          </TableBodyCell>
          <TableBodyCell class="align-top" style="max-width: 230px;">
            <Heading tag="h6" class="w-full overflow-hidden text-ellipsis"
              >{item.title}</Heading
            >
            <span class="font-thin">by: {item.author}</span>
            <br />
            <span class="font-thin">Published: {item.publication_year}</span>
          </TableBodyCell>
          <TableBodyCell class="align-top text-center"
            >{item.genre}</TableBodyCell
          >
          <TableBodyCell class="align-top text-center">
            <Button color="red" outline on:click={() => removeFromCart(item)}>
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
    <section class="w-full text-right">
      {#if $cart_items.length}
        <Button disabled={processing} on:click={handleReservation}>
          {#if processing}
            <Spinner size={4} class="me-2" />
          {/if}
          Reserve
        </Button>
      {/if}
      <Button
        disabled={processing}
        on:click={() => (openCart = false)}
        color="alternative"
      >
        Close
      </Button>
    </section>
  </svelte:fragment>
</Modal>
