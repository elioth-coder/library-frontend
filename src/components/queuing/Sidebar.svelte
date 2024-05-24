<script>
  import {
    Card,
    Heading,
    Hr,
    Label,
    Select,
  } from "flowbite-svelte";

  let publication_start, publication_end;
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

  let book_genre;
  let book_genres = genres.map( genre => {
    return {
      name: genre,
      value: genre,
    }
  });
</script>

<section class="w-96 min-h-full dark:bg-gray-800 bg-gray-100 p-3">
  <Heading tag="h5" class="font-normal">Narrow Search</Heading>
  <Card padding="xs" class="px-4 mt-2">
    <Heading tag="h6" class="text-center">Publication Year</Heading>
    <Hr hrClass="my-3" />
    <section class="flex gap-3">
      <Label class="w-full">
        <span>FROM:</span>
        <Select
          class="mt-2"
          placeholder="--from--"
          items={publication_years}
          bind:value={publication_start}
        />
      </Label>
      <Label class="w-full">
        <span>TO:</span>
        <Select
          class="mt-2"
          placeholder="--to--"
          items={publication_years}
          bind:value={publication_end}
        />
      </Label>
    </section>
  </Card>
  <Card padding="xs" class="px-4 mt-2">
    <Heading tag="h6" class="text-center">Genre</Heading>
    <Hr hrClass="my-3" />
    <Label class="w-full">
      <span>GENRE:</span>
      <Select
        class="mt-2"
        placeholder="--genre--"
        items={book_genres}
        bind:value={book_genre}
      />
    </Label>
  </Card>
</section>
