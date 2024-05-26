<script lang="ts">
  import {
    Sidebar,
    SidebarDropdownWrapper,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import {
    AngleDownOutline,
    AngleUpOutline,
    ArrowRightToBracketOutline,
    StackoverflowSolid,
    PieChartSolid,
    RectangleListSolid,
    UsersGroupSolid,
    ArrowUpDownOutline,
    FileChartBarSolid,
    CogOutline,
    DrawSquareOutline,
    OrdoredListOutline,
  } from "flowbite-svelte-icons";
  import { location, replace } from "svelte-spa-router";
  import UserService from "../services/UserService";

  let drawerHidden: boolean = false;

  let spanClass = "ms-9 truncate";
  let childClass =
    "truncate p-2 hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 relative flex items-center flex-wrap font-medium";

  let nonActiveClass =
    childClass +
    " hover:text-gray-500 hover:cursor-pointer dark:text-gray-400 dark:hover:text-white";
  let activeClass = childClass + " cursor-default dark:text-primary-700";

  $: mainSidebarUrl = $location;
  $: activeMainSidebar = "#" + $location;

  let posts = [
    { name: "Dashboard", icon: PieChartSolid, href: "#/" },
    { name: "Queuing No.", icon: OrdoredListOutline, href: "#/manage_queuing" },
    {
      name: "Borrow / Return",
      icon: ArrowUpDownOutline,
      href: "#/transact",
      children: {
        Borrow: "#/transact/borrow",
        Return: "#/transact/return",
      },
    },
    {
      name: "List of Books",
      icon: StackoverflowSolid,
      href: "#/books",
      children: {
        Copies: "#/books/copies",
        Overdue: "#/books/overdue",
        Wishlist: "#/books/wishlist",
      },
    },
    {
      name: "List of Members",
      icon: UsersGroupSolid,
      href: "#/members",
      children: {
        Pending: "#/members/pending",
        Approved: "#/members/approved",
        Rejected: "#/members/rejected",
      },
    },
    {
      name: "List of Records",
      icon: RectangleListSolid,
      href: "#/records",
      children: {
        Books: "#/records/books",
        Campuses: "#/records/campuses",
      },
    },
    {
      name: "Reports",
      icon: FileChartBarSolid,
      href: "#/reports",
      children: {
        "Student Members": "#/reports/student_members",
        "Inventory of Books": "#/reports/books_inventory",
        "Available Books": "#/reports/books_available",
        "Borrowed Books": "#/reports/books_borrowed",
        "Collected Penalties": "#/reports/books_returned",
        "Entry Logs": "#/reports/entry_logs",
      },
    },
    { name: "Entry Logger", icon: DrawSquareOutline, href: "#/entry_logger" },
    {
      name: "Settings",
      icon: CogOutline,
      href: "#/settings",
    },  
  ];

  let dropdowns = Object.fromEntries(Object.keys(posts).map((x) => [x, false]));
  let userService = new UserService();

  const handleLogout = async (e) => {
    e.preventDefault();
    const continue_logout = confirm("Do you want to log out?");

    if (continue_logout) {
      try {
        await userService.logout();
        return replace("/sign-in");
      } catch (e) {
        alert("Failed to log out.");
      }
    }
  };
</script>

<Sidebar
  class={drawerHidden ? "hidden" : ""}
  {nonActiveClass}
  {activeClass}
  activeUrl={mainSidebarUrl}
  asideClass="fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-20 lg:-mt-2 lg:block"
>
  <SidebarWrapper
    divClass="overflow-y-auto px-3 pt-20 lg:pt-4 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-4.5rem)] lg:block dark:bg-gray-800 lg:me-0 lg:sticky top-2"
  >
    <nav class="divide-y text-base font-medium">
      <SidebarGroup ulClass="list-unstyled fw-normal small mb-4 space-y-2">
        {#each posts as { name, icon, children, href } (name)}
          {#if children}
            <SidebarDropdownWrapper
              isOpen={activeMainSidebar.indexOf(href?.toLowerCase()) >= 0}
              label={name}
              ulClass="mt-0.5"
              btnClass="flex p-2 rounded-lg items-center justify-start gap-4 w-full text-base font-medium tracking-wide hover:text-primary-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              spanClass="truncate"
              class={dropdowns[name]
                ? "text-primary-700 dark:text-white"
                : "text-gray-500 dark:text-gray-400"}
            >
              <AngleDownOutline
                slot="arrowdown"
                class="ms-auto text-gray-800 dark:text-white"
              />
              <AngleUpOutline
                slot="arrowup"
                class="ms-auto text-gray-800 dark:text-white"
              />
              <svelte:component this={icon} slot="icon" />
              {#each Object.entries(children) as [title, href]}
                <SidebarItem
                  label={title}
                  {href}
                  {spanClass}
                  {activeClass}
                  class={activeMainSidebar == href
                    ? "text-primary-700 dark:text-primary-700"
                    : ""}
                  active={activeMainSidebar.indexOf(title.toLowerCase()) >= 0}
                />
              {/each}
            </SidebarDropdownWrapper>
          {:else}
            <SidebarItem
              label={name}
              {href}
              class={activeMainSidebar == href
                ? "text-primary-700 dark:text-primary-700"
                : ""}
            >
              <svelte:component this={icon} slot="icon" />
            </SidebarItem>
          {/if}
        {/each}
      </SidebarGroup>
      <SidebarGroup ulClass="list-unstyled fw-normal small pt-4 space-y-2">
        <SidebarItem label="Log out" on:click={handleLogout}>
          <ArrowRightToBracketOutline slot="icon" />
        </SidebarItem>
      </SidebarGroup>
    </nav>
  </SidebarWrapper>
</Sidebar>