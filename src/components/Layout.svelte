<script>
  import "../app.pcss";
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import currentUser from "../stores/CurrentUserStore";

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
<div class="overflow-hidden lg:flex">
  <div id="sidebar">
    <Sidebar />
  </div>
  <div class="relative h-full w-full overflow-y-auto lg:ml-64">
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