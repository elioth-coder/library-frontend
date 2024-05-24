<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Heading } from "flowbite-svelte";
  import BookCopyPageContent from "../components/book_copy/BookCopyPageContent.svelte";
  let crumbs = [
    {
      href: "#/books",
      title: "List of Books",
    },
    {
      href: "#/books/copies",
      title: "Copies",
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="p-3">
      <Heading tag="h4" class="text-center">Copies of Books</Heading>
      <BookCopyPageContent />
    </div>
  </main>
</Layout>
