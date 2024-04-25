<script>
  import { Input, List } from "flowbite-svelte";
  import { onMount } from "svelte";

  export let name;
  export let value = '';
  export let required = false;
  export let placeholder = "Select an option.";
  export let options = [];

  let searchInput = "";
  let focused = false;
  let filteredOptions = [...options];

  const setInputBoxValue = (value) => {
    let option = options.filter((option) => {
      return option.value == value;
    })[0];

    if (option) {
      searchInput = option.text;
    }
  };

  $: searchInput,
    (() => {
      filteredOptions = options.filter((option) => {
        return (
          option.text.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0
        );
      });
    })();

  const handleSelection = (option) => {
    focused = false;
    searchInput = option.text;
    value = option.value;
  };

  onMount(() => {
    setInputBoxValue(value);
  });

  const handleFocus = (e) => {
    let input = e.target;

    input.select();
    focused = true;
  }

</script>

<div class="relative w-100">
  <div class="w-100 rounded cursor-pointer">
    <input type="hidden" bind:value {name} />
    <Input
      {required}
      on:focus={handleFocus}
      on:blur={() => setTimeout(() => (focused = false), 400)}
      bind:value={searchInput}
      {placeholder}
    />
  </div>

  {#if focused}
    <List
      class="dark:border-gray-700 absolute top-full left-0 w-full bg-white border rounded shadow-md max-h-48 overflow-y-auto z-50"
    >
      {#each filteredOptions as option (option.value)}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="dark:border-gray-700 dark:hover:bg-gray-600 dark:bg-gray-800 dark:text-white p-2 cursor-pointer hover:bg-gray-100 border-b"
          on:click={() => handleSelection(option)}
        >
          {option.text}
        </li>
      {:else}
        <li class="dark:bg-gray-800 dark:text-white p-2 border-b">
          No match found.
        </li>
      {/each}
    </List>
  {/if}
</div>
