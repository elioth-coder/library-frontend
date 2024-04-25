<script>
  // @ts-nocheck

  import { Label, Select } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import AuthorService from "../../services/AuthorService";
  import DropdownSearch from "../DropdownSearch.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  export let book_id;
  let author_options = [];
  let id, author_id, type;
  let types = [
    { value: "Main Author", name: "Main Author" },
    { value: "Co-Author", name: "Co-Author" },
  ];

  $: if (Boolean(item)) {
    id = item.id;
    author_id = item.author_id;
    type = item.type;
  }

  onMount(async () => {
    let service = new AuthorService();
    let authors = await service.getAll();

    if(authors.length) {
      author_options = authors.map(
        author => ({ value: author.id, text: `${author.first_name} ${author.last_name}` })
      );
    }
  });
</script>

<form
  id="book_author_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  <input value={id ?? ""} type="hidden" name="id" id="id" />
  <input value={book_id ?? ""} type="hidden" name="book_id" id="book_id" />
  <button type="submit" class="hidden"></button>
  <div class="mb-6">
    <Label for="author_id" class="mb-2">Author</Label>
    {#if author_options.length}
      <DropdownSearch 
        name="author_id" 
        value={author_id} 
        options={author_options} 
      />
    {:else}
      <DropdownSearch name="author_id" options={[]} />
    {/if}
  </div>
  <div class="mb-6">
    <Label for="status" class="mb-2">Type</Label>
    <Select
      name="type"
      class="mt-2"
      items={types}
      bind:value={type}
    />
  </div>
</form>
