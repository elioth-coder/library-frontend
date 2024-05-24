<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Heading } from "flowbite-svelte";
  import BookAuthorPageContent from "../components/book_author/BookAuthorPageContent.svelte";
  
  export let params = {};

  let id = params.id;
  let crumbs = [
    {
      href: "#/records",
      title: "Records",
    },
    {
      href: "#/records/books",
      title: "Books",
    },
    {
      href: `#/records/books/${id}/author`,
      title: "Author",
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <Heading tag="h1" class="mb-4 text-xl sm:text-2xl">All book authors</Heading
    >
    <BookAuthorPageContent book_id={id} />
  </main>
</Layout>
