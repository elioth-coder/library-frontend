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
  import MemberService from "../services/MemberService";
  import { sortBy } from "lodash-es";
  import EntryLogService from "../services/EntryLogService";
  import { PrinterOutline } from "flowbite-svelte-icons";

  let crumbs = [
    {
      href: "#/report",
      title: "Reports",
    },
    {
      href: "#/report/log_entry",
      title: "Entry Logs",
    },
  ];
  let memberService = new MemberService();
  let entryLogService = new EntryLogService();
  let items = [];
  let asyncItems;

  const getEntryLogs = async () => {
    let entries = await entryLogService.getAll();
    let logs  = [];

    for(let i=0; i<entries.length; i++) {
      let item = entries[i];
      item.member = await memberService.get(item.member_id);

      logs.push(item);
    }

    return logs;
  }

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.member.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.member.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.member.course.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      (item.member.year_level + '').toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
  })

  onMount(async () => {
    asyncItems = getEntryLogs();
    items = await asyncItems;
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4">
        Entry Logs of Members
        <a href="#/print_report/entry_logs" target="_blank">
          <Button size="xs" color="dark" class="float-right" outline>
            <PrinterOutline class="me-1"/>
            Print
          </Button>
        </a>
      </Heading>
      <TableSearch 
        hoverable={true}
        placeholder="Search member details"
        bind:inputValue={searchTerm}
      >
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
          <TableHeadCell>Time Logged</TableHeadCell>
          <TableHeadCell>Card No.</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Gender</TableHeadCell>
          <TableHeadCell>Course</TableHeadCell>
        </TableHead>
         <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={5} class="text-center"
                >Generating report...</TableBodyCell
              >
            </TableBodyRow>
          {/await}
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell class="align-top">{item.dt_logged}</TableBodyCell>
              <TableBodyCell class="align-top">{item.member.card_number.toUpperCase()}</TableBodyCell>
              <TableBodyCell class="align-top">
                {item.member.first_name} {item.member.last_name}<br>
                ({item.member.type})
              </TableBodyCell>
              <TableBodyCell class="align-top">{item.member.gender}</TableBodyCell>
              <TableBodyCell class="align-top">
                {(item.member.type=='Student') ? `${item.member.course} ${item.member.year_level}` : "N/A"}
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
        {#if items}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" colspan={5} class="py-3 px-6 text-base">
                Total No. of Entries:
                {items.length}
              </th>
            </tr>
          </tfoot>
        {/if}
      </TableSearch>
    </div>
  </main>
</Layout>
