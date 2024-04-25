<script>
  // @ts-nocheck

  import { Input, Label, Textarea } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import DropdownSearch from "../DropdownSearch.svelte";
  import PublisherService from "../../services/PublisherService";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let publisher_options = [];
  let id, title, publication_year, genre, publisher_id, page_count, language, edition, synopsis;

  $: if (Boolean(item)) {
    id = item.id;
    title = item.title;
    genre = item.genre;
    publisher_id = item.publisher_id;
    publication_year = item.publication_year;    
    language = item.language;
    page_count = item.page_count;
    edition = item.edition;
    synopsis = item.synopsis;
  }

  onMount(async () => {
    let service = new PublisherService();
    let publishers = await service.getAll();

    if(publishers.length) {
      publisher_options = publishers.map(
        publisher => ({ value: publisher.id, text: publisher.name })
      );
    }
  });

</script>

<form
  id="book_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  <input value={id ?? ""} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="title" class="mb-2">Title</Label>
      <Input disabled={processing} value={(title ?? "")} type="text" name="title" id="title" placeholder="Enter book title" required />
    </div>
    <div>
      <Label for="genre" class="mb-2">Genre</Label>
      <Input disabled={processing} value={(genre ?? "")} type="text" name="genre" id="genre" placeholder="Enter book genre" required />
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="publisher_id" class="mb-2">Publisher</Label>
      {#if publisher_options.length}
        <DropdownSearch name="publisher_id" options={publisher_options} />
      {:else}
        <DropdownSearch name="publisher_id" options={[]} />
      {/if}
    </div>
    <div>
      <Label for="publication_year" class="mb-2">Publication year</Label>
      <Input
        disabled={processing}
        value={publication_year ?? ""}
        type="text"
        name="publication_year"
        id="publication_year"
        placeholder="Enter publication year"
        required
      />  
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-4">
    <div class="col-span-2">
      <Label for="language" class="mb-2">Language</Label>
      <Input
        disabled={processing}
        value={language ?? ""}
        type="text"
        name="language"
        id="language"
        placeholder="Enter book language"
        required
      />  
    </div>
    <div>
      <Label for="page_count" class="mb-2">Page count</Label>
      <Input
        disabled={processing}
        value={page_count ?? ""}
        type="text"
        name="page_count"
        id="page_count"
        placeholder="Enter page count"
        required
      />  
    </div>
    <div>
      <Label for="edition" class="mb-2">Edition</Label>
      <Input
        disabled={processing}
        value={edition ?? ""}
        type="text"
        name="edition"
        id="edition"
        placeholder="Enter edition"
        required
      />  
    </div>
  </div>
  <div class="mb-6">
    <Label for="synopsis" class="mb-2">Synopsis</Label>
    <Textarea
      class="h-24"
      disabled={processing}
      value={synopsis ?? ""}
      type="text"
      id="synopsis"
      name="synopsis"
      placeholder="Enter book synopsis"
      required
    ></Textarea>
  </div>
</form>
