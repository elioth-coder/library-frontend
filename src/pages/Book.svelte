<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import BookPageContent from "../components/book/BookPageContent.svelte";
  import { Heading } from "flowbite-svelte";

  let crumbs = [
    {
      href: "#/records",
      title: "Records",
    },
    {
      href: "#/records/books",
      title: "Books",
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Book Titles</Heading>
      <BookPageContent />
    </div>
  </main>
</Layout>
