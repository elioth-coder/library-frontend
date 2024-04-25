<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import PublisherPageContent from "../components/publisher/PublisherPageContent.svelte";
  import { Heading } from "flowbite-svelte";
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb />
    <Heading tag="h1" class="mb-4 text-xl sm:text-2xl">All publishers</Heading>
    <PublisherPageContent />
  </main>
</Layout>
