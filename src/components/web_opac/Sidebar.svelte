<script>
  import {
    Card,
    Heading,
    Hr,
    Label,
    Listgroup,
    ListgroupItem,
    P,
    Select,
  } from "flowbite-svelte";

  let campuses = [{ name: "General Tinio (Papaya)" }, { name: "Peñaranda" }];

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
</script>

<section class="w-96 min-h-full dark:bg-gray-800 bg-gray-100 p-3">
  <Heading tag="h5" class="font-normal">Narrow Search</Heading>
  <Listgroup active class="w-full my-3">
    <ListgroupItem current={true}>CAMPUS</ListgroupItem>
    {#each campuses as campus}
      <ListgroupItem on:click={() => alert(campus.name)}>
        {campus.name}
      </ListgroupItem>
    {/each}
  </Listgroup>

  <Card padding="xs" class="px-4">
    <P class="font-normal">YEAR OF PUBLICATION</P>
    <Hr hrClass="my-1" />
    <section class="flex gap-1">
      <Label>
        FROM:
        <Select
          class="mt-2"
          placeholder="Year"
          items={publication_years}
          bind:value={publication_start}
        />
      </Label>
      <Label>
        TO:
        <Select
          class="mt-2"
          placeholder="Year"
          items={publication_years}
          bind:value={publication_end}
        />
      </Label>
    </section>
  </Card>
</section>
