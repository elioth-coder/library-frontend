<script>
  import {
    Button,
    Checkbox,
    Spinner,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { EditOutline, TrashBinSolid } from "flowbite-svelte-icons";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let asyncItems;
  let items = [];

  let searchTerm = '';

  $: filteredItems = items.filter(
    (item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.barcode.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.status.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        (item.publication_year + '').toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    }
  );

  $: asyncItems.then(async (fetchedItems) => {
    items = [...fetchedItems];
  });
</script>

<TableSearch 
  placeholder="Search book details"
  hoverable={true}
  bind:inputValue={searchTerm}
>
  <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
    <TableHeadCell class="pe-0 text-center"><Checkbox /></TableHeadCell>
    <TableHeadCell class="px-0 text-center">ACTION</TableHeadCell>
    <TableHeadCell>Barcode</TableHeadCell>
    <TableHeadCell>ISBN / Title</TableHeadCell>
    <TableHeadCell>Copyright</TableHeadCell>
    <TableHeadCell>Status</TableHeadCell>
  </TableHead>
  <TableBody>
    {#await asyncItems}
      <TableBodyRow>
        <TableBodyCell colspan={6} class="text-center">
          <Spinner size={4} class="me-1" />
          Fetching items...
        </TableBodyCell>
      </TableBodyRow>
    {:catch error}
      <TableBodyRow>
        <TableBodyCell
          colspan={5}
          class="text-center text-red-600"
        >
          {error.message}
        </TableBodyCell>
      </TableBodyRow>
    {/await}
    {#if items}
      {#each filteredItems as item}
        <TableBodyRow>
          <TableBodyCell class="pe-0 text-center"><Checkbox /></TableBodyCell>
          <TableBodyCell class="px-0 space-x-2 text-center">
            <Button
              on:click={() => dispatch("edit", item)}
              size="sm"
              class="gap-2"
            >
              <EditOutline size="sm" />
            </Button>
            <Button
              on:click={() => dispatch("delete", item)}
              color="red"
              size="sm"
              class="gap-2"
            >
              <TrashBinSolid size="sm" />
            </Button>
          </TableBodyCell>
          <TableBodyCell>{item.barcode}</TableBodyCell>
          <TableBodyCell title={item.title} style="max-width: 210px;" class="text-ellipsis overflow-hidden">
            <span class="text-xs text-gray-500">ISBN: {item.isbn}</span><br>
            {item.title}
          </TableBodyCell>
          <TableBodyCell title={item.publication_year} style="max-width: 60px;" class="text-ellipsis overflow-hidden">{item.publication_year}</TableBodyCell>
          <TableBodyCell title={item.status} style="max-width: 60px;" class="text-ellipsis overflow-hidden">{item.status}</TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={6} class="text-center">
            No items found.
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</TableSearch>
