<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Hr, Heading, Card, Button } from "flowbite-svelte";
  import DashboardService from "../services/DashboardService";
  import { onMount } from "svelte";
  import BookCopyService from "../services/BookCopyService";
  import ReserveService from "../services/ReserveService";
  import WishlistService from "../services/WishlistService";

  let dashboardService = new DashboardService();
  let bookCopyService = new BookCopyService();
  let reserveService = new ReserveService();
  let wishlistService = new WishlistService();
  let crumbs = [
    {
      href: "#/books",
      title: "List of Books",
    },
  ];

  let borrowed, copies, reserved, wishlist;

  onMount(async () => {
    let borrowedResults = await dashboardService.countBooks("Borrowed");
    borrowed = borrowedResults[0].count;
    copies = await bookCopyService.count();
    reserved = await reserveService.count();
    wishlist = await wishlistService.count();
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="grid grid-cols-4 gap-8 px-5">
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Copies of Books</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{copies ?? 0}</Heading>
        <Button class="w-auto" href="#/books/copies">View list of copies</Button
        >
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Borrowed Books</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{borrowed ?? 0}</Heading>
        <Button class="w-auto" href="#/books/borrowed"
          >View list of borrowed</Button
        >
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Books On Reserve</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{reserved ?? 0}</Heading>
        <Button class="w-auto" href="#/books/reserved"
          >View list of reserved</Button
        >
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Books On Wishlist</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{wishlist ?? 0}</Heading>
        <Button class="w-auto" href="#/books/reserved"
          >View wishlist</Button
        >
      </Card>
    </div>
    <Hr />
  </main>
</Layout>
