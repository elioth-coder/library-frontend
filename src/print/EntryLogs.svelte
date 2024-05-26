<script>
  import {
    Heading,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Table,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import MemberService from "../services/MemberService";
  import EntryLogService from "../services/EntryLogService";

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

  onMount(async () => {
    asyncItems = getEntryLogs();
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
    Entry Logs of Members
  </Heading>
  <Table>
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
      {#each items as item}
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
  </Table>
</main>
