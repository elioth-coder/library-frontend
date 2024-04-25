<script>
// @ts-nocheck

  import { Input, Label, Select } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import BookService from "../../services/BookService";
  import DropdownSearch from "../DropdownSearch.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, book_id, barcode, status;
  let book_options = [];
  let book_statuses = [
    { value: 'Available', name: 'Available' },
    { value: 'Borrowed', name: 'Borrowed' },
    { value: 'Missing', name: 'Missing' },
  ];

  $: if (Boolean(item)) {
    id = item.id;
    book_id = item.book_id;
    barcode = item.barcode;
    status  = item.status;
  }

  onMount(async () => {
    let service = new BookService();
    let books = await service.getAll();

    if(books.length) {
      book_options = books.map(
        book => ({ value: book.id, text: book.title })
      );
    }
  });
</script>

<form
  id="book_copy_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  <input value={id ?? ""} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="mb-6">
    <Label for="book_id" class="mb-2">Book</Label>
    {#if book_options.length}
      <DropdownSearch value={book_id ?? ""} name="book_id" options={book_options} />
    {:else}
      <DropdownSearch name="book_id" options={[]} />
    {/if}
  </div>
  <div class="mb-6">
    <Label for="barcode" class="mb-2">Barcode</Label>
    <Input
      disabled={processing}
      value={barcode ?? ""}
      type="text"
      name="barcode"
      id="barcode"
      placeholder="Enter book barcode"
      required
    />
  </div>
  <div class="mb-6">
    <Label for="status" class="mb-2">Status</Label>
    <Select 
      name="status" 
      class="mt-2" 
      items={book_statuses} 
      bind:value={status} 
    />
  </div>
</form>
