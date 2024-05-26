<script>
    import { Button, Heading, Modal, Spinner, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import BookService from "../services/BookService";
    import ReserveService from "../services/ReserveService";
    import { createEventDispatcher, onMount } from "svelte";
  
    const dispatch = createEventDispatcher();
  
    export let queue;
    let {HOST} = CONFIG;
    let processing = false;
    let bookService = new BookService();
    let reserveService = new ReserveService();

    let items = [];
    let asyncItems;

    const getReservedBooks = async (queue_id) => {
      let reserveItems = await reserveService.getBy('number', queue_id);
      let books = [];

      for(let i=0; i<reserveItems.length; i++) {
        let reserveItem = reserveItems[i];
        let book = await bookService.get(reserveItem.book_id);

        books.push(book);
      }

      return books;
    }

    onMount(async () => {
      console.log({queue});

      asyncItems = getReservedBooks(queue.id);
      items = await asyncItems;
    })

    function notify(text) {
      // Check if the browser supports speech synthesis
      if (!('speechSynthesis' in window)) {
        alert('Your browser does not support speech synthesis. Please use a supported browser.');
        return;
      }

      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Set the utterance properties (optional)
      utterance.lang = 'en-US'; // Language
      utterance.pitch = 1; // Pitch (0 to 2)
      utterance.rate = 1; // Rate (0.1 to 10)
      utterance.volume = 1; // Volume (0 to 1)

      // Speak the utterance
      window.speechSynthesis.speak(utterance);
    }
  </script>
  
  <Modal title="Reserved books for queue #{queue.id}" open={true} on:close>
    <Table>
      <TableHead>
        <TableHeadCell></TableHeadCell>
        <TableHeadCell class="align-top">Cover</TableHeadCell>
        <TableHeadCell class="align-top">Title</TableHeadCell>
        <TableHeadCell class="align-top text-center">Genre</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#await asyncItems}
          <TableBodyRow>
            <TableBodyCell class="text-center" colspan={5}>Fetching items..</TableBodyCell>
          </TableBodyRow>
        {/await}
        {#each items as item, index}
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
                  style="height: 70px;"
                />
              {/if}
            </TableBodyCell>
            <TableBodyCell class="align-top">
              <Heading tag="h6">{item.title}</Heading>
              <span class="font-thin">
                by: {item.author}
              </span>
              <br />
              <span class="font-thin">Published: {item.publication_year}</span>
            </TableBodyCell>
            <TableBodyCell class="align-top text-center">
              {item.genre}
            </TableBodyCell>
          </TableBodyRow>
        {:else}
          <TableBodyRow>
            <TableBodyCell class="text-center" colspan={4}>
              No items found.
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  
    <svelte:fragment slot="footer">
      <section class="w-full text-right">
        <Button color="green" on:click={() => notify(`Customer number ${queue.id} please proceed to the counter.`)}>
          Notify
        </Button>
        <Button on:click={() => dispatch('close')} color="alternative">
          Close
        </Button>
      </section>
    </svelte:fragment>
  </Modal>
  