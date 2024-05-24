<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import Toast from "../components/Toast.svelte";
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
  import UserService from "../services/UserService";
  import MemberInfoModal from "./MemberInfoModal.svelte";
  import RejectReasonModal from "./RejectReasonModal.svelte";

  let crumbs = [
    {
      href: "#/members",
      title: "List of Members",
    },
    {
      href: "#/members/pending",
      title: "Pending",
    },
  ];
  let memberService = new MemberService();
  let userService = new UserService();
  let searchTerm = "";
  let items = [];
  let processing = false;
  let selectedItem = null;
  let notification = null;

  $: filteredItems = items.filter(
    (item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.gender.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.course.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        item.type.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    }
  );

  const handleRejection = () => {
    showReason = true;
    hideMemberInfo();
  }

  const handleApproval = async () => {
    processing = true;
    let _notification = {
      position: "top-right",
      status: "success",
    };

    let member = { ...selectedItem };
    let memberFormData = new FormData();
    memberFormData.set("id", member.id);
    memberFormData.set("status", "Approved");
    await memberService.update(memberFormData);

    let userFormData = new FormData();
    userFormData.set("id", member.user_id);
    userFormData.set("role", member.type);
    await userService.update(userFormData);

    _notification.message = `Successfully approved the membership`;

    setTimeout(async () => {
      refreshItems();
      processing = false;
      hideMemberInfo();
      selectedItem = null;
      notification = { ..._notification };
    }, 100);
  };

  const getMembers = async () => {
    let members = await memberService.getBy("status", "Pending");
    let results = members.map((member) => {
      member.name = `${member.first_name} ${member.last_name}`;

      return member;
    });

    return results;
  };

  let asyncItems;
  let showInfo = false;
  let showReason = false;

  const showMemberInfo = (item) => {
    selectedItem = item;
    showInfo = true;
  }

  const hideMemberInfo = () => {
    showInfo = false;
  }

  const hideReasonForm = () => {
    showReason = false;
  }

  const handleReason = async (formData) => {
    processing = true;
    let _notification = {
      position: "top-right",
      status: "success",
    };

    await memberService.update(formData);

    _notification.message = `Successfully rejected the membership`;

    setTimeout(async () => {
      refreshItems();
      processing = false;
      notification = { ..._notification };
      hideReasonForm();
    }, 100);
  }

  const refreshItems = async () => {
    asyncItems = getMembers();
    items = await asyncItems;
  }
  
  onMount(async () => {
    await refreshItems();
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Library Members (Pending)</Heading>
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
              <TableBodyCell class="text-right 2-16">{index + 1}.</TableBodyCell>
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
      bind:show={showInfo}
      member={selectedItem}
      {processing}
      on:approve={handleApproval}
      on:reject={handleRejection}
      on:close={hideMemberInfo}
    />

    <RejectReasonModal 
      bind:show={showReason}
      {processing}
      member={selectedItem}
      on:submit={({detail}) => handleReason(detail)}
      on:close={hideReasonForm}
    />

    {#if notification !== null}
      <Toast {...notification} on:close={() => (notification = null)} />
    {/if}
  </main>
</Layout>
