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
  import MemberService from "../services/MemberService";
  import { onMount } from "svelte";
  import MemberInfoModal from "./MemberInfoModal.svelte";

  let crumbs = [
    {
      href: "#/members",
      title: "List of Members",
    },
    {
      href: "#/members/approved",
      title: "Approved",
    },
  ];
  let memberService = new MemberService();
  let searchTerm = "";
  let selectedItem = null;
  let items = [];

  $: filteredItems = items.filter(
    (item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.card_number.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.gender.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.course.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.type.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    }
  );

  let show = false;
  const showMemberInfo = (item) => {
    selectedItem = item;
    show = true;
  }

  const hideMemberInfo = () => {
    selectedItem = null;
    show = false;
  }

  const getMembers = async () => {
    let members = await memberService.getBy("status", "Approved");
    let results = members.map((member) => {
      member.name = `${member.first_name} ${member.last_name}`;

      return member;
    });

    return results;
  };

  let asyncItems;

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
      <Heading tag="h4" class="text-center">Library Members (Approved)</Heading>
      <TableSearch
        placeholder="Search by member details"
        hoverable={true}
        bind:inputValue={searchTerm}
      >
        <TableHead>
          <TableHeadCell class="text-right">No.</TableHeadCell>
          <TableHeadCell>Card Number</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Gender</TableHeadCell>
          <TableHeadCell>Course</TableHeadCell>
          <TableHeadCell>Type</TableHeadCell>
          <TableHeadCell class="text-center">Action</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#await asyncItems}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center">Fetching items...</TableBodyCell>
            </TableBodyRow>
          {/await}
          {#each filteredItems as item, index}
            <TableBodyRow>
              <TableBodyCell class="text-right w-16">{index + 1}.</TableBodyCell>
              <TableBodyCell>{item.card_number}</TableBodyCell>
              <TableBodyCell>{item.name}</TableBodyCell>
              <TableBodyCell>{item.gender}</TableBodyCell>
              <TableBodyCell>{item.course}</TableBodyCell>
              <TableBodyCell>{item.type}</TableBodyCell>
              <TableBodyCell class="text-center">
                <Button on:click={() => showMemberInfo(item)}>
                  Show details
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {:else}
            <TableBodyRow>
              <TableBodyCell colspan={7} class="text-center">No members found.</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </TableSearch>
    </div>

    <MemberInfoModal 
      bind:show={show}
      member={selectedItem}
      on:close={hideMemberInfo}
    />
  </main>
</Layout>
