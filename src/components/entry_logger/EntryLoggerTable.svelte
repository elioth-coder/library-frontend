<script>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

export let items;
</script>

<Table striped={true} hoverable={true}>
  <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
    <TableHeadCell class="text-right">No.</TableHeadCell>
    <TableHeadCell>Time Logged</TableHeadCell>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>Course</TableHeadCell>
  </TableHead>
  <TableBody>
    {#if items}
      {#each items as item, index}
        <TableBodyRow>
          <TableBodyCell class="align-top text-right w-16">{index + 1}.</TableBodyCell>
          <TableBodyCell class="align-top">{item.dt_logged}</TableBodyCell>
          <TableBodyCell class="align-top">
            {#await item.member}
              Loading...
            {:then member}
              {`${member?.first_name ?? ""} ${member?.last_name ?? ""}`}<br>
              ({member?.type ?? ""})
            {/await}
          </TableBodyCell>
          <TableBodyCell class="align-top">
            {#await item.member}
              Loading...
            {:then member}
              {(member.type=='Student') ? `${member.course} ${member.year_level}` : "N/A"}
            {/await}
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={4} class="text-center">
            No items found.
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</Table>
