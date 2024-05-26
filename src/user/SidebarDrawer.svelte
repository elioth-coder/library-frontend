<script>
  import { Listgroup, Button, CloseButton, Drawer } from "flowbite-svelte";
  import { HomeOutline, UserCircleOutline, ArrowUpRightFromSquareOutline, ArrowDownToBracketOutline, HeartOutline, StackoverflowSolid, SearchOutline, ArrowRightToBracketOutline } from "flowbite-svelte-icons";
  import { sineIn } from "svelte/easing";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  export let hideDrawer = true;

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

  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn
  };

  let icons = [
    { name: 'Dashboard', icon: HomeOutline, href:'#/user' },
    { name: 'Search books', icon: SearchOutline, href:'#/user/search' },
    { name: 'Borrowed', icon: ArrowUpRightFromSquareOutline, href:'#/user/borrowed' },
    { name: 'Returned', icon: ArrowDownToBracketOutline, href:'#/user/returned' },
    { name: 'My Wishlist', icon: HeartOutline, href:'#/user/wishlist' },
    { name: 'My Profile', icon: UserCircleOutline, href:'#/user/profile' },
  ];
</script>

<Drawer placement="right" transitionType="fly" {transitionParams} bind:hidden={hideDrawer} id="sidebar5">
  <div class="flex items-center border-b">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
      <StackoverflowSolid class="w-8 h-8 me-2.5" />NEUST Library
    </h5>
    <CloseButton on:click={() => (hideDrawer = true)} class="mb-4 dark:text-white" />
  </div>
  <div class="flex flex-col py-3">
    <Listgroup active items={icons} let:item class="w-full" on:click={console.log}>
      <svelte:component this={item.icon} class="w-6 h-6 me-2.5 inline-block"/>
      <span class="text-lg">{item.name}</span>
    </Listgroup>
  </div>
  <div class="flex justify-center border-t py-5 mt-4">
    <Button on:click={handleLogout} 
      outline href="/" class="w-full"
    >
      <ArrowRightToBracketOutline class="me-2" />
      Log out
    </Button>
  </div>
</Drawer>