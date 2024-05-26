<script>
  import {
    Button,
    Checkbox,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { EditOutline, TrashBinSolid, UsersOutline } from "flowbite-svelte-icons";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let asyncItems;
  let items;

  $: asyncItems.then(async (fetchedItems) => {
    items = [...fetchedItems];
  });
</script>

<Table striped={true} hoverable={true}>
  <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
    <TableHeadCell class="pe-0 text-center"><Checkbox /></TableHeadCell>
    <TableHeadCell class="px-0 text-center">ACTION</TableHeadCell>
    <TableHeadCell>ISBN</TableHeadCell>
    <TableHeadCell>Title</TableHeadCell>
    <TableHeadCell>Copyright</TableHeadCell>
    <TableHeadCell>Author</TableHeadCell>
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
          colspan={6}
          class="text-center text-red-600"
        >
          {error.message}
        </TableBodyCell>
      </TableBodyRow>
    {/await}
    {#if items}
      {#each items as item}
        <TableBodyRow>
          <TableBodyCell style="max-width: 20px;" class="pe-0 text-center"><Checkbox /></TableBodyCell>
          <TableBodyCell style="max-width: 100px;" class="px-0 space-x-2 text-center">
            <Button
              title="Edit"
              on:click={() => dispatch("edit", item)}
              size="sm"
              class="gap-2"
            >
              <EditOutline size="sm" />
            </Button>
            <Button
              title="Delete"
              on:click={() => dispatch("delete", item)}
              color="red"
              size="sm"
              class="gap-2"
            >
              <TrashBinSolid size="sm" />
            </Button>
          </TableBodyCell>
          <TableBodyCell title={item.isbn} style="max-width: 130px;" class="text-ellipsis overflow-hidden">{item.isbn}</TableBodyCell>
          <TableBodyCell title={item.title} style="max-width: 210px;" class="text-ellipsis overflow-hidden">{item.title}</TableBodyCell>
          <TableBodyCell title={item.author} style="max-width: 60px;" class="text-ellipsis overflow-hidden">{item.author}</TableBodyCell>
          <TableBodyCell title={item.publication_year} style="max-width: 60px;">{item.publication_year}</TableBodyCell>
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
</Table>
