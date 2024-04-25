<script>
// @ts-nocheck

  import { Button, Input, Toolbar, ToolbarButton, ToolbarGroup } from "flowbite-svelte";
  import { CogOutline, DotsVerticalOutline, ExclamationCircleSolid, TrashBinSolid } from "flowbite-svelte-icons";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
	let timer;

	const debounce = query => {
		clearTimeout(timer);
		timer = setTimeout(() => {
      dispatch('search', query);
		}, 750);
	}
  export let table_name;
</script>

<Toolbar embedded class="-mx-2 w-full p-2 text-gray-500 dark:text-gray-400">
  <ToolbarGroup class="w-80 xl:w-96">
    <Input placeholder="Search for {table_name.replace('_', ' ')}" 
      on:keyup={({ target: { value } }) => debounce(value)}
    />
  </ToolbarGroup>
  <div slot="end">
    <Button
      on:click={() => dispatch('add_item')}
      size="sm"
      class="whitespace-nowrap"
    >
      Add new {table_name.replace('_', ' ')}
    </Button>
  </div>
</Toolbar>