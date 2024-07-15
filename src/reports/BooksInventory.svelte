<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
  Button,
    Heading,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import ReportService from "../services/ReportService";
  import { PrinterOutline } from "flowbite-svelte-icons";

  let crumbs = [
    {
      href: "#/report",
      title: "Reports",
    },
    {
      href: "#/report/book_inventory",
      title: "Inventory of Books",
    },
  ];
  let reportService = new ReportService();
  let items = [];
  let asyncItems;

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.isbn.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  })

  onMount(async () => {
    asyncItems = reportService.booksInventory();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4 relative">
        Books - Inventory
        <a href="#/print_report/books_inventory" target="_blank">
          <Button size="xs" color="dark" class="absolute right-0 top-1/2 -mt-4" outline>
            <PrinterOutline class="me-1"/>
            Print
          </Button>
        </a>
      </Heading>
      <TableSearch 
        hoverable={true}
        placeholder="Search book details"
        bind:inputValue={searchTerm}
      >
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
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell class="align-top overflow-hidden text-ellipsis" style="max-width: 330px;">
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
        {#if filteredItems}
        {@const availableTotal = filteredItems.reduce((prev, current)=> prev += current.available, 0)}
        {@const borrowedTotal  = filteredItems.reduce((prev, current)=> prev += current.borrowed, 0)}
        {@const damagedTotal   = filteredItems.reduce((prev, current)=> prev += current.damaged, 0)}
        {@const lostTotal      = filteredItems.reduce((prev, current)=> prev += current.lost, 0)}
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
      </TableSearch>
    </div>
  </main>
</Layout>
