<script>
  import {
    Heading,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import ReportService from "../services/ReportService";

  let reportService = new ReportService();
  let items = [];
  let asyncItems;

  onMount(async () => {
    asyncItems = reportService.booksInventory();
    items = await asyncItems;

    setTimeout(() => {
      window.print();

    }, 2000);

    window.onafterprint = function() {
      window.close();
    };
  });
</script>

<main>
  <Heading tag="h4" class="text-center mb-4">
    Inventory of Books
  </Heading>
  <Table>
    <TableHead>
      <TableHeadCell>Book Title</TableHeadCell>
      <TableHeadCell class="text-center">Available</TableHeadCell>
      <TableHeadCell class="text-center">Borrowed</TableHeadCell>
      <TableHeadCell class="text-center">Damaged</TableHeadCell>
      <TableHeadCell class="text-center">Lost</TableHeadCell>
      <TableHeadCell class="text-center">Total</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#await asyncItems}
        <TableBodyRow>
          <TableBodyCell colspan={7} class="text-center">Generating report...</TableBodyCell>
        </TableBodyRow>
      {/await}
      {#each items as item}
        <TableBodyRow>
          <TableBodyCell class="align-top text-wrap" style="max-width: 250px;">
            <span class="text-gray-500">ISBN: {item.isbn}</span><br>
            {item.title}
          </TableBodyCell>
          <TableBodyCell class="align-top text-center">{item.available}</TableBodyCell>
          <TableBodyCell class="align-top text-center">{item.borrowed}</TableBodyCell>
          <TableBodyCell class="align-top text-center">{item.damaged}</TableBodyCell>
          <TableBodyCell class="align-top text-center">{item.lost}</TableBodyCell>
          {@const total = item.available + item.borrowed + item.damaged + item.lost}
          <TableBodyCell class="align-top text-center font-semibold text-gray-900">{total}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
    {#if items}
    {@const availableTotal = items.reduce((prev, current)=> prev += current.available, 0)}
    {@const borrowedTotal  = items.reduce((prev, current)=> prev += current.borrowed, 0)}
    {@const damagedTotal   = items.reduce((prev, current)=> prev += current.damaged, 0)}
    {@const lostTotal      = items.reduce((prev, current)=> prev += current.lost, 0)}
    {@const overallTotal   = availableTotal + borrowedTotal + damagedTotal + lostTotal}
    <tfoot>
      <tr class="font-semibold text-gray-900 dark:text-white">
        <th scope="row" class="py-3 px-6 text-base">Total</th>
        <td class="py-3 px-6 text-center">{availableTotal}</td>
        <td class="py-3 px-6 text-center">{borrowedTotal}</td>
        <td class="py-3 px-6 text-center">{damagedTotal}</td>
        <td class="py-3 px-6 text-center">{lostTotal}</td>
        <td class="py-3 px-6 text-center">{overallTotal}</td>
      </tr>
    </tfoot>
    {/if}
  </Table>
</main>