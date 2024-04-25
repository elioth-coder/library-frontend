<script>
  // @ts-nocheck

  import { Input, Label } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, first_name, middle_name, last_name;

  $: if (Boolean(item)) {
    id = item.id;
    first_name = item.first_name;
    middle_name = item.middle_name;
    last_name = item.last_name;
  }
</script>

<form
  id="author_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  <input value={id ?? ""} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="mb-6">
    <Label for="first_name" class="mb-2">First Name</Label>
    <Input
      disabled={processing}
      value={first_name ?? ""}
      type="text"
      name="first_name"
      id="first_name"
      placeholder="Enter first name"
      required
    />
  </div>
  <div class="mb-6">
    <Label for="middle_name" class="mb-2">Middle Name</Label>
    <Input
      disabled={processing}
      value={middle_name ?? ""}
      type="middle_name"
      name="middle_name"
      id="middle_name"
      placeholder="Enter middle name"
      required
    />
  </div>
  <div class="mb-6">
    <Label for="last_name" class="mb-2">Last Name</Label>
    <Input
      disabled={processing}
      value={last_name ?? ""}
      type="text"
      id="last_name"
      name="last_name"
      placeholder="Enter last name"
      required
    />
  </div>
</form>
