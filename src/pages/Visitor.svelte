<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Heading } from "flowbite-svelte";
  import VisitorPageContent from "../components/visitor/VisitorPageContent.svelte";
  let crumbs = [
    {
      href: "#/library/card",
      title: "Library",
    },
    {
      href: "#/library/visitor",
      title: "Visitor",
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <Heading tag="h1" class="mb-4 text-xl sm:text-2xl"
      >All library visitors</Heading
    >
    <VisitorPageContent />
  </main>
</Layout>
