<script>
  import "../app.pcss";
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import NewSidebar from "./NewSidebar.svelte";
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import currentUser from "../stores/CurrentUserStore";
  import { BookSolid, UsersGroupSolid, PieChartSolid, CogSolid } from "flowbite-svelte-icons";

  let userService = new UserService();
  let user;

  onMount(async () => {
    try {
      user = await userService.me();
      $currentUser = {...user};
    } catch (e) {
      alert(e.message);
      replace("/sign-in");
    }
  });
</script>

<header
  class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
  <Navbar {user} />
</header>
<div class="overflow-hidden flex h-full">
  <div id="sidebar" class="border-r min-w-96 overflow-hidden h-screen flex">
    <NewSidebar />
    <!-- <Sidebar /> -->
  </div>
  <div class="relative h-screen w-full overflow-y-auto pb-16">
    <slot />
  </div>
</div>

<style>
@media print {
  header, #sidebar {
    display: none !important;
  }
}
</style>