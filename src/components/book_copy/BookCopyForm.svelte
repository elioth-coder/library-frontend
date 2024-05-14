<script>
// @ts-nocheck

  import { Input, Label, Select } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import BookService from "../../services/BookService";
  import DropdownSearch from "../DropdownSearch.svelte";
  import { format } from "date-fns";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, book_id, call_no, barcode, price, status;
  let date = new Date();
  let date_added = format(date, 'yyyy-MM-dd');
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
  <input type="hidden" name="date_added" value={date_added}>
  <button type="submit" class="hidden"></button>
  <div class="mb-6">
    <Label for="book_id" class="mb-2">Book</Label>
    {#if book_options.length}
      <DropdownSearch value={book_id ?? ""} name="book_id" options={book_options} />
    {:else}
      <DropdownSearch name="book_id" options={[]} />
    {/if}
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
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
      <Label for="call_no" class="mb-2">Call number</Label>
      <Input
        disabled={processing}
        value={call_no ?? ""}
        type="text"
        name="call_no"
        id="call_no"
        placeholder="Enter book call number"
        required
      />
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div class="mb-6">
      <Label for="price" class="mb-2">Price</Label>
      <Input
        disabled={processing}
        value={price ?? ""}
        type="text"
        name="price"
        id="price"
        placeholder="Enter book's price"
        required
      />
    </div>
    <div class="mb-6">
      <Label for="status" class="mb-2">Status</Label>
      <Select 
        name="status" 
        class="mt-2" 
        items={book_statuses} 
        value={status} 
      />
    </div>
  </div>
</form>
