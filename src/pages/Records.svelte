<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Hr, Heading, Card, Button } from "flowbite-svelte";
  import DashboardService from "../services/DashboardService";
  import { onMount } from "svelte";

  let dashboardService = new DashboardService();
  let crumbs = [
    {
      href: "#/records",
      title: "Records",
    },
  ];
  let borrowed = 0,
    missing = 0,
    available = 0,
    newBooks = 0,
    total = 0;

  onMount(async () => {
    let borrowedResults = await dashboardService.countBooks("Borrowed");
    let missingResults = await dashboardService.countBooks("Missing");
    let availableResults = await dashboardService.countBooks("Available");
    let newBooksResults = await dashboardService.countBooks("New");
    let dailyVisitorsResults = await dashboardService.dailyVisitors();
    let dailyVisitors = dailyVisitorsResults[0];

    console.log({ dailyVisitors });

    borrowed = borrowedResults[0].count;
    missing = missingResults[0].count;
    available = availableResults[0].count;
    newBooks = newBooksResults[0].count;
    total = borrowed + missing + available;

  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="grid grid-cols-3 gap-8 px-5">
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Books</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">10</Heading>
        <Button class="w-auto" href="#/records/books">View list of books</Button>
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Authors</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">10</Heading>
        <Button class="w-auto" href="#/records/authors">View list of authors</Button>
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Publishers</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">10</Heading>
        <Button class="w-auto" href="#/records/publishers">View list of publishers</Button>
      </Card>

    </div>
    <Hr />
  </main>
</Layout>
