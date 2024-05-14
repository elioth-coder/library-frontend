<script>
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  export let crumbs = [
    {
      href: '#/publisher',
      title: 'Publisher',
    },
  ];
</script>

<Breadcrumb class="mb-5">
  <BreadcrumbItem href="#/">Dashboard</BreadcrumbItem>
  {#each crumbs as crumb}
    <BreadcrumbItem href={crumb.href}>{crumb.title}</BreadcrumbItem>
  {/each}
</Breadcrumb>
