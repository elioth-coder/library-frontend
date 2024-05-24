<script>
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import AdminDashboard from "./AdminDashboard.svelte";
  import StudentDashboard from "./StudentDashboard.svelte";

  let userService = new UserService();
  let asyncUser;

  onMount(() => {
    asyncUser = userService.me();
  });
</script>

{#await asyncUser}
  <h1 class="text-center">Loading...</h1>
{:then user}
  {#if user?.role=='Admin'}
    <AdminDashboard />
  {:else}
    <StudentDashboard />
  {/if}
{/await}
