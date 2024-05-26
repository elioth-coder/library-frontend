<script>
  import { Heading } from "flowbite-svelte";
  import { BarsOutline, StackoverflowSolid } from "flowbite-svelte-icons";
  import { createEventDispatcher } from "svelte";
  import { replace } from "svelte-spa-router";

  const dispatch = createEventDispatcher();
</script>
<header class="flex border-b p-3 dark:border-b-gray-800 dark:text-gray-400 dark:bg-gray-800">
  <StackoverflowSolid size="xl" 
    class="cursor-pointer inline-block me-2" 
    on:click={() => replace('#/user')}
  />
  <Heading tag="h4" class="cursor-pointer">
    NEUST Library
  </Heading>
  <BarsOutline size="xl" 
    class="cursor-pointer inline-block me-2" 
    on:click={() => dispatch('hide-drawer')}
  />
</header>