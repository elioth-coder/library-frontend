<script>
// @ts-nocheck

  import { Input, Label } from "flowbite-svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, name, location, email;

  $: if(Boolean(item)) {
    id = item.id;
    name = item.name;
    location = item.location;
    email = item.email;
  }
</script>

<form id="publisher_form" on:submit|preventDefault={(e) => dispatch('submit', new FormData(e.target))}>
  <input value={(id ?? "")} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="name" class="mb-2">Name</Label>
      <Input disabled={processing} value={(name ?? "")} type="text" name="name" id="name" placeholder="Enter publisher name" required />
    </div>
    <div>
      <Label for="email" class="mb-2">Email address</Label>
      <Input disabled={processing} value={(email ?? "")} type="email" name="email" id="email" placeholder="Enter email address" required />
    </div>
  </div>
  <div class="mb-6">
    <Label for="location" class="mb-2">Location</Label>
    <Input disabled={processing} value={(location ?? "")}
      type="text"
      id="location"
      name="location"
      placeholder="Enter publisher location"
      required
    />
  </div>
</form>
