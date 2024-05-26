<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
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

  let crumbs = [
    {
      href: "#/reports",
      title: "Reports",
    },
    {
      href: "#/student_members",
      title: "Student Members",
    },
  ];
  let memberService = new MemberService();
  let items = [];
  let asyncItems;

  const getMembers = async () => {
    let members = await memberService.getBy('status', 'Approved');
    members = members.filter(member => member.type=='Student');

    return sortBy(members, (member) => member.last_name);
  };

  let searchTerm;
  $: filteredItems = items.filter((item) => {
    return item.last_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || 
      item.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      item.course.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      (item.year_level + '').toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 
  })

  onMount(async () => {
    asyncItems = getMembers();
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
        List of Student Members
      </Heading>
      <TableSearch 
        hoverable={true}
        placeholder="Search member details"
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell>Card No.</TableHeadCell>
          <TableHeadCell>Student Name</TableHeadCell>
          <TableHeadCell>Gender</TableHeadCell>
          <TableHeadCell>Course & Yr.</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Date Registered</TableHeadCell>
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
              <TableBodyCell>{item.card_number}</TableBodyCell>
              <TableBodyCell>{item.last_name}, {item.first_name}</TableBodyCell>
              <TableBodyCell>{item.gender}</TableBodyCell>
              <TableBodyCell>{item.course} {item.year_level}</TableBodyCell>
              <TableBodyCell>{item.email}</TableBodyCell>
              <TableBodyCell>{item.issue_date}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
        {#if items}
          <tfoot>
            <tr class="font-semibold text-gray-900 dark:text-white">
              <th scope="row" colspan={5} class="py-3 px-6 text-base">
                Total No. of Students:
                {items.length}
              </th>
            </tr>
          </tfoot>
        {/if}
      </TableSearch>
    </div>
  </main>
</Layout>
