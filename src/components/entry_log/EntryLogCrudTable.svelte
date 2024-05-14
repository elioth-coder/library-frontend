<script>
  import {
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import AsyncText from "../AsyncText.svelte";
  import MemberService from "../../services/MemberService";

  const dispatch = createEventDispatcher();
  export let columns;
  export let asyncItems;
  let items;
  let memberService = new MemberService();

  const getMemberFullName = async (id) => {
    let member = await memberService.get(id);

    return `${member.first_name} ${member.last_name}`;
  }

  $: asyncItems.then(async (fetchedItems) => {
    items = [...fetchedItems];
  });
</script>

<Table striped={true} hoverable={true}>
  <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
    {#each columns as column}
      <TableHeadCell>{column.replace("_", " ")}</TableHeadCell>
    {/each}
  </TableHead>
  <TableBody>
    {#await asyncItems}
      <TableBodyRow>
        <TableBodyCell colspan={columns.length} class="text-center">
          <Spinner size={4} class="me-1" />
          Fetching items...
        </TableBodyCell>
      </TableBodyRow>
    {:catch error}
      <TableBodyRow>
        <TableBodyCell
          colspan={columns.length}
          class="text-center text-red-600"
        >
          {error.message}
        </TableBodyCell>
      </TableBodyRow>
    {/await}
    {#if items}
      {#each items as item}
        <TableBodyRow>
          {#each columns as column}
            {#if column == "member_id"}
              <TableBodyCell class="font-thin">
                <AsyncText promise={getMemberFullName(item[column])} />
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
          <TableBodyCell colspan={columns.length} class="text-center">
            No items found.
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</Table>
