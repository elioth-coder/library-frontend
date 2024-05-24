<script>
  import Layout from "../Layout.svelte";
  import Breadcrumb from "../Breadcrumb.svelte";
  import { Heading } from "flowbite-svelte";
  import CampusPageContent from "../campus/CampusPageContent.svelte";

  let crumbs = [
    {
      href: "#/records",
      title: "Records",
    },
    {
      href: "#/records/campuses",
      title: "Campuses",
    },
  ];
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center">Campuses</Heading>
      <CampusPageContent />
    </div>
  </main>
</Layout>
