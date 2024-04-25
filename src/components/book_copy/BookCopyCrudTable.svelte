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
  import { EditOutline, TrashBinSolid } from "flowbite-svelte-icons";
  import { createEventDispatcher } from "svelte";
  import AsyncText from "../AsyncText.svelte";
  import BookService from "../../services/BookService";

  const dispatch = createEventDispatcher();
  export let columns;
  export let asyncItems;
  let items;
  let bookService = new BookService();

  const getBookTitle = async (id) => {
    let book = await bookService.get(id);

    return book.title;
  }

  $: asyncItems.then(async (fetchedItems) => {
    items = [...fetchedItems];
  });
</script>

<Table striped={true} hoverable={true}>
  <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
    <TableHeadCell class="pe-0 text-center"><Checkbox /></TableHeadCell>
    <TableHeadCell class="px-0 text-center">ACTION</TableHeadCell>
    {#each columns as column}
      <TableHeadCell>{column.replace("_", " ")}</TableHeadCell>
    {/each}
  </TableHead>
  <TableBody>
    {#await asyncItems}
      <TableBodyRow>
        <TableBodyCell colspan={columns.length + 2} class="text-center">
          <Spinner size={4} class="me-1" />
          Fetching items...
        </TableBodyCell>
      </TableBodyRow>
    {:catch error}
      <TableBodyRow>
        <TableBodyCell
          colspan={columns.length + 2}
          class="text-center text-red-600"
        >
          {error.message}
        </TableBodyCell>
      </TableBodyRow>
    {/await}
    {#if items}
      {#each items as item}
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
          {#each columns as column}
            {#if column=='book_id'}
              <TableBodyCell class="font-thin">
                <AsyncText promise={getBookTitle(item[column])} />
              </TableBodyCell>
            {:else}
              <TableBodyCell class="font-thin">
                {item[column]}
              </TableBodyCell>
            {/if}
          {/each}
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={columns.length + 2} class="text-center">
            No items found.
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</Table>
