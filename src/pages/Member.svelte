<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Button, Heading, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
  import MemberService from "../services/MemberService";
  import { onMount } from "svelte";
  import { CheckOutline, CloseOutline } from "flowbite-svelte-icons";

  let crumbs = [
    {
      href: "#/members",
      title: "Members",
    },
  ];
  let memberService = new MemberService();
  let searchTerm = '';
  let items = [];
  $: filteredItems = items.filter((item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

  onMount(async () => {
    let members = await memberService.getAll();
    items = members.map(member => {
      member.name = `${member.first_name} ${member.last_name}`;

      return member;
    });
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="p-3">
      <Heading tag="h1" class="mb-4 text-xl sm:text-2xl">All members</Heading>
      <TableSearch placeholder="Search by member name" hoverable={true} bind:inputValue={searchTerm}>
        <TableHead>
          <TableHeadCell class="text-center">Action</TableHeadCell>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Gender</TableHeadCell>
          <TableHeadCell>Type</TableHeadCell>
          <TableHeadCell>Course</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#each filteredItems as item}
            <TableBodyRow>
              <TableBodyCell class="text-center">
                <Button size="xs" color="green" title="Approve">
                  <span><CheckOutline /></span>
                </Button>
                <Button size="xs" color="red" title="Reject">
                  <span><CloseOutline /></span>
                </Button>
              </TableBodyCell>
              <TableBodyCell>{item.id}</TableBodyCell>
              <TableBodyCell>{item.name}</TableBodyCell>
              <TableBodyCell>{item.gender}</TableBodyCell>
              <TableBodyCell>{item.type}</TableBodyCell>
              <TableBodyCell>{item.course}</TableBodyCell>
              <TableBodyCell>{item.status}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>
  </main>
</Layout>
