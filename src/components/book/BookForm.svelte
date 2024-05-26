<script>
  // @ts-nocheck
  import { Input, Label, Select } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import ImageInput from "../ImageInput.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id,
    title,
    isbn,
    cover,
    old_cover,
    publication_year,
    genre,
    publisher,
    page_count,
    language,
    edition,
    author;

  let { HOST } = CONFIG;

  const language_options = [
    { name: "English", value: "English" },
    { name: "Spanish", value: "Spanish" },
    { name: "French", value: "French" },
    { name: "German", value: "German" },
    { name: "Chinese", value: "Chinese" },
    { name: "Japanese", value: "Japanese" },
    { name: "Russian", value: "Russian" },
    { name: "Arabic", value: "Arabic" },
    { name: "Portuguese", value: "Portuguese" },
    { name: "Hindi", value: "Hindi" },
    { name: "Tagalog", value: "Tagalog" },
  ];

  let publication_years = (() => {
    let date = new Date();
    let year = date.getFullYear();
    let years = [];
    for (let i = year; i >= 1900; i--) {
      years.push({
        name: i,
        value: i,
      });
    }

    return years;
  })();

  let genres = [
    'Fiction',
    'Non-Fiction',
    "Children's Books",
    'Comics',
    'Poetry',
    'Drama/Plays',
    'Anthologies',
    'Classics',
    'Reference',
    'Textbooks',
    'Self-Published Books',
    'Magazines and Periodicals',
  ];

  let book_genres = genres.map( genre => {
    return {
      name: genre,
      value: genre,
    }
  });

  $: if (Boolean(item)) {
    id = item.id;
    title = item.title;
    isbn = item.isbn;
    genre = item.genre;
    publisher = item.publisher;
    publication_year = item.publication_year;
    language = item.language;
    page_count = item.page_count;
    edition = item.edition;
    author = item.author;
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
    if (item?.cover) {
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
      <Select
        disabled={processing}
        value={genre ?? ""}
        type="text"
        name="genre"
        id="genre"
        items={book_genres}
        placeholder="Enter book genre"
        required
      />
    </div>
    <div>
      <Label for="publication_year" class="mb-2">Publication year</Label>
      <Select
        disabled={processing}
        value={publication_year ?? ""}
        type="text"
        name="publication_year"
        id="publication_year"
        items={publication_years}
        placeholder="Enter publication year"
        required
      />
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-4">
    <div class="col-span-2">
      <Label for="edition" class="mb-2">Edition</Label>
      <Input
        disabled={processing}
        value={edition ?? ""}
        type="text"
        name="edition"
        id="edition"
        placeholder="Enter edition"
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
        placeholder="--page count--"
        required
      />
    </div>
    <div>
      <Label for="language" class="mb-2">Language</Label>
      <Select
        disabled={processing}
        value={language ?? ""}
        type="text"
        name="language"
        id="language"
        items={language_options}
        placeholder="--language--"
        required
      />
    </div>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="publisher" class="mb-2">Publisher</Label>
      <Input
        disabled={processing}
        value={publisher ?? ""}
        type="text"
        name="publisher"
        id="publisher"
        placeholder="Enter book publisher"
        required
      />
    </div>
    <div>
      <Label for="author" class="mb-2">Author</Label>
      <Input
        disabled={processing}
        value={author ?? ""}
        type="text"
        name="author"
        id="author"
        placeholder="Enter book author"
        required
      />
    </div>
  </div>
</form>
