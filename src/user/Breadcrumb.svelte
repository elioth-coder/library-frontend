<script>
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  export let crumbs = [
    {
      href: '#/',
      title: 'Dashboard',
    },
  ];
</script>

<Breadcrumb class="mb-5">
  <BreadcrumbItem href="#/user">Dashboard</BreadcrumbItem>
  {#each crumbs as crumb}
    <BreadcrumbItem href={crumb.href}>{crumb.title}</BreadcrumbItem>
  {/each}
</Breadcrumb>
