<script>
  // @ts-nocheck
  import { Input, Label, Textarea } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import DropdownSearch from "../DropdownSearch.svelte";
  import PublisherService from "../../services/PublisherService";
  import ImageInput from "../ImageInput.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let publisher_options = [];
  let id,
    title,
    isbn,
    cover,
    old_cover,
    publication_year,
    genre,
    publisher_id,
    page_count,
    language,
    edition,
    synopsis;

  let { HOST } = CONFIG;

  $: if (Boolean(item)) {
    id = item.id;
    title = item.title;
    isbn = item.isbn;
    genre = item.genre;
    publisher_id = item.publisher_id;
    publication_year = item.publication_year;
    language = item.language;
    page_count = item.page_count;
    edition = item.edition;
    synopsis = item.synopsis;
  }

  async function loadImageToBase64(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let base64Data = canvas.toDataURL("image/jpeg"); 

        resolve(base64Data);
      };

      img.onerror = function (error) {
        reject("Error loading image: " + error);
      };

      img.src = url;
    });
  }

  onMount(async () => {
    let service = new PublisherService();
    let publishers = await service.getAll();

    if (publishers.length) {
      publisher_options = publishers.map((publisher) => ({
        value: publisher.id,
        text: publisher.name,
      }));
    }

    if(item?.cover) {
      old_cover = item.cover;
      cover = await loadImageToBase64(`${HOST}/static/uploads/${item.cover}`);
    }

  });
</script>

<form
  id="book_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  {#if id}
    <input value={id ?? ""} type="hidden" name="id" id="id" />
  {/if}
  {#if old_cover}
    <input value={old_cover ?? ""} type="hidden" name="cover" id="cover" />
  {/if}
  <button type="submit" class="hidden"></button>
  <div class="w-1/2 mx-auto mb-2">
    {#if cover}
      <ImageInput required="true" photo={cover} name="base64" />
    {:else}
      <ImageInput required="true" name="base64" />
    {/if}
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="title" class="mb-2">Title</Label>
      <Input
        disabled={processing}
        value={title ?? ""}
        type="text"
        name="title"
        id="title"
        placeholder="Enter book title"
        required
      />
    </div>
    <div>
      <Label for="genre" class="mb-2">ISBN</Label>
      <Input
        disabled={processing}
        value={isbn ?? ""}
        type="text"
        name="isbn"
        id="isbn"
        placeholder="Enter book ISBN"
        required
      />
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="genre" class="mb-2">Genre</Label>
      <Input
        disabled={processing}
        value={genre ?? ""}
        type="text"
        name="genre"
        id="genre"
        placeholder="Enter book genre"
        required
      />
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
    <Label for="publisher_id" class="mb-2">Publisher</Label>
    {#if publisher_options.length}
      <DropdownSearch value={publisher_id ?? ""} placeholder="Select a publisher" name="publisher_id" options={publisher_options} />
    {:else}
      <DropdownSearch placeholder="Select a publisher" name="publisher_id" options={[]} />
    {/if}
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
