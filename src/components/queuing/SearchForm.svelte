<script>
  import { Input, Select, Button } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
  import { push } from "svelte-spa-router";

  let types = [
    { name: 'Title', value: 'title' },
    { name: 'Author', value: 'author' },
    { name: 'Category', value: 'category' },
    { name: 'ISBN', value: 'isbn' },
  ];

  const handleSubmit = (e) => {
    let formData = new FormData(e.target);

    if(formData.get('type')) {
      push(`/queuing/search/?query=${formData.get('query')}&type=${formData.get('type')}`)
    } else {
      push(`/queuing/search/?query=${formData.get('query')}`)
    }
  }

</script>

<form on:submit|preventDefault={handleSubmit} class="flex w-full">
  <Input name="query" placeholder="Type a word to search." />
  <Select name="type" class="w-52 mx-2" items={types} placeholder="All fields" />
  <Button type="submit">
    <SearchOutline class="w-5 h-5 me-2" /> Search
  </Button>
</form>
