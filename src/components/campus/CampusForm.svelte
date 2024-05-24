<script>
// @ts-nocheck

  import { Input, Label } from "flowbite-svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, name, location;

  $: if(Boolean(item)) {
    id = item.id;
    name = item.name;
    location = item.location;
  }
</script>

<form id="campus_form" on:submit|preventDefault={(e) => dispatch('submit', new FormData(e.target))}>
  <input value={(id ?? "")} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="grid grid-cols-1 gap-2">
      <Label for="name" class="mb-2">Name</Label>
      <Input disabled={processing} 
        value={(name ?? "")} 
        type="text" 
        name="name" id="name" 
        placeholder="Enter campus name" 
        required 
      />
      <Label for="location" class="mb-2">Location</Label>
      <Input disabled={processing} value={(location ?? "")}
        type="text"
        id="location"
        name="location"
        placeholder="Enter campus location"
        required
      />
  </div>
</form>
