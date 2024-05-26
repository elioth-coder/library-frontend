<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
    Button,
    Heading,
    Hr,
    Input,
    Label,
    Select,
    Spinner,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Toast from "../components/Toast.svelte";
  import QueueService from "../services/QueueService";
  import ReserveService from "../services/ReserveService";
  import { sortBy } from "lodash-es";
  import QueuingItemsModal from "../components/QueuingItemsModal.svelte";

  let crumbs = [
    {
      href: "#/manage_queuing",
      title: "Queuing No.",
    },
  ];
  let notification = null;
  let queueService = new QueueService();
  let reserveService = new ReserveService();
  let items = [];
  let asyncItems;

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return (item.id + '').toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.dt_created.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  });

  let queue = null;

  const getQueuingNumbers = async () => {
    let numbers = await queueService.getAll();
    let queuingNumbers = [];

    for(let i=0; i<numbers.length; i++) {
      let number = numbers[i];

      number.count = await reserveService.countBy('number', number.id);
      queuingNumbers.push(number);
    }

    return sortBy(queuingNumbers, (queue) => queue.id);
  }

  onMount(async () => {
    asyncItems = getQueuingNumbers();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4">Queuing No.</Heading>
      <TableSearch 
      hoverable={true}
      placeholder="Search book details"
      bind:inputValue={searchTerm}
    >
      <TableHead>
        <TableHeadCell class="text-center">DATETIME</TableHeadCell>
        <TableHeadCell class="text-center">QUEUE NO.</TableHeadCell>
        <TableHeadCell class="text-center">BOOKS</TableHeadCell>
        <TableHeadCell class="text-center">ACTION</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#await asyncItems}
          <TableBodyRow>
            <TableBodyCell colspan={4} class="text-center"
              >Fetching items...</TableBodyCell
            >
          </TableBodyRow>
        {/await}
        {#each filteredItems as item}
          <TableBodyRow>
            <TableBodyCell class="text-center">{item.dt_created}</TableBodyCell>
            <TableBodyCell class="text-center">
              <Heading tag="h4">{item.id}</Heading>
            </TableBodyCell>
            <TableBodyCell class="text-center">{item.count}</TableBodyCell>
            <TableBodyCell class="text-center">
              <Button class="w-20" color="blue" on:click={() => (queue = item)}>View</Button>
              <Button class="w-20" href="#/transact/borrow/?queue_number={item.id}">Process</Button>
            </TableBodyCell>
          </TableBodyRow>
        {:else}
        <TableBodyRow>
          <TableBodyCell colspan={4} class="text-center">
            No items found.
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
      {#if items}
        <tfoot>
          <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="py-3 px-6 text-base text-center">
              Total Queuing # : {items.length}
            </th>
            <th class="text-center"></th>
          </tr>
        </tfoot>
      {/if}
    </TableSearch>
    </div>

    {#if queue !== null}
      <QueuingItemsModal {queue} on:close={() => (queue = null)} />
    {/if}
    {#if notification !== null}
      <Toast {...notification} on:close={() => (notification = null)} />
    {/if}
  </main>
</Layout>
