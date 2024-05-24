<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Hr } from "flowbite-svelte";
  import DashboardService from "../services/DashboardService";
  import { onMount } from "svelte";

  let dashboardService = new DashboardService();
  let crumbs = [];

  onMount(async () => {

  })
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="flex">
    </div>
    <Hr />
  </main>
</Layout>
