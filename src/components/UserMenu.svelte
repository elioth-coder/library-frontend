<script lang="ts">
  import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
  } from "flowbite-svelte";

  export let name: string = "";
  export let email: string = "";
</script>

<button class="mr-2 rounded-full ring-gray-400 focus:ring-4 dark:ring-gray-600">
  <Avatar size="sm" src="/src/profile.png " tabindex="0" />
</button>
<Dropdown>
  <DropdownHeader>
    <span class="block text-sm">{name}</span>
    <span class="block truncate text-sm font-medium">{email}</span>
  </DropdownHeader>
  <DropdownItem>Dashboard</DropdownItem>
  <DropdownItem>Settings</DropdownItem>
  <DropdownDivider />
  <DropdownItem>Sign out</DropdownItem>
</Dropdown>
