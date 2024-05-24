<script lang="ts">
  import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
  } from "flowbite-svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";

  export let name: string = "";
  export let email: string = "";
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

<button class="mr-2 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
  <Avatar size="sm" src="/src/profile.png " tabindex="0" />
</button>
<Dropdown>
  <DropdownHeader>
    <span class="block text-sm">{name}</span>
    <span class="block truncate text-sm font-medium">{email}</span>
  </DropdownHeader>
  <DropdownItem href="#/">Dashboard</DropdownItem>
  <DropdownDivider />
  <DropdownItem on:click={handleLogout}>Logout</DropdownItem>
</Dropdown>
