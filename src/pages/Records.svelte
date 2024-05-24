<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import { Hr, Heading, Card, Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import BookService from "../services/BookService";
  import PublisherService from "../services/PublisherService";
  import AuthorService from "../services/AuthorService";

  let bookService = new BookService();
  let authorService = new AuthorService();
  let publisherService = new PublisherService();
  let crumbs = [
    {
      href: "#/records",
      title: "Records",
    },
  ];
  let books, authors, publishers;

  onMount(async () => {
    books = await bookService.count();
    authors = await authorService.count();
    publishers = await publisherService.count();
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
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{books ?? 0}</Heading>
        <Button class="w-auto" href="#/records/books">View list of books</Button>
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Authors</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{authors ?? 0}</Heading>
        <Button class="w-auto" href="#/records/authors">View list of authors</Button>
      </Card>
      <Card size="xl" class="mt-8" padding="sm">
        <Heading tag="h5">Publishers</Heading>
        <Hr hrClass="h-px my-5 bg-gray-200 border-0 dark:bg-gray-700" />
        <Heading tag="h1" class="text-center mt-3 mb-2.5">{publishers ?? 0}</Heading>
        <Button class="w-auto" href="#/records/publishers">View list of publishers</Button>
      </Card>

    </div>
    <Hr />
  </main>
</Layout>
