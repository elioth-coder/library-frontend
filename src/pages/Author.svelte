<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Heading } from "flowbite-svelte";
  import AuthorPageContent from "../components/author/AuthorPageContent.svelte";

  let crumbs = [
    {
      href: '#/records',
      title: 'Records',
    },
    {
      href: '#/records/authors',
      title: 'Authors',
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Book Authors</Heading>
      <AuthorPageContent />
    </div>
  </main>
</Layout>
