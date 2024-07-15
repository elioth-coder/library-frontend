<script>
  import { Hr } from "flowbite-svelte";
  import {
    BookSolid,
    ChartOutline,
    ChartSolid,
    CogSolid,
    PieChartSolid,
    UsersGroupSolid,
  } from "flowbite-svelte-icons";
  import { afterUpdate, onMount } from "svelte";
  import { link, location, querystring } from "svelte-spa-router";
  import active from "svelte-spa-router/active";

  let activeItem = {};

  const setActiveItem = (item) => {
    activeItem = {...item};
  }

  let activeSubitem = {};

  const setActiveSubitem = (item) => {
    activeSubitem = {...item};
  }

  let previousUrl = '';

  afterUpdate(() => {
    console.log('after update executed');

    if(previousUrl != $location) {
      let [_, itemName, subitemName] = $location.split('/');

      let item = items.filter(item => item.name == itemName)[0];
      setActiveItem(item);
      if(activeItem.items?.length) {
        if(!subitemName) {
          subitemName = 'dashboard';
        }
        
        let subitem = activeItem.items.filter(item => item.name == subitemName)[0];
        setActiveSubitem(subitem);
      }
      previousUrl = $location;
    }
  })

  let items = [
    {
      name  : 'report', 
      title : 'Report',
      icon  : ChartOutline,
      items : [
        {
          name  : 'dashboard', 
          title : 'Dashboard',
          url   : '#/report',
          type  : 'link',
        },
        {
          name  : 'book_inventory', 
          title : 'Books - Inventory',
          url   : '#/report/book_inventory',
          type  : 'link',
        },
        {
          name  : 'book_borrowed', 
          title : 'Books - Borrowed',
          url   : '#/report/book_borrowed',
          type  : 'link',
        },
        {
          name  : 'member', 
          title : 'Members',
          url   : '#/report/member',
          type  : 'link',
        },
        {
          name  : 'log_entry', 
          title : 'Logs - Entry',
          url   : '#/report/log_entry',
          type  : 'link',
        },
      ]
    },
    {
      name  : 'book', 
      title : 'Book',
      icon  : BookSolid,
      items : [
        {
          name  : 'dashboard', 
          title : 'Dashboard',
          url   : '#/report/dashboard',
          type  : 'link',
        },        
      ]
    },
    {
      name   : 'member', 
      title  : 'Member',
      icon   : UsersGroupSolid,
    },
    {
      name   : 'setting', 
      title  : 'Setting',
      icon   : CogSolid,
    },
  ]

  onMount(() => {
    setActiveItem(items[0]);
  });
</script>

<div class="h-full min-w-20 border-r">
  {#each items as item}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <section 
      on:click={() => setActiveItem(item)}
      class="hover:bg-slate-200 block p-3 text-center cursor-pointer"
      class:active={item.name==activeItem.name}
    >
      <svelte:component 
        this={item.icon} 
        size="xl" 
        class="m-auto"></svelte:component>
      <span class="text-xs font-bold -mt-1">{item.title}</span>
    </section>
  {/each}
</div>
<div class="h-full w-full overflow-y-auto p-5">
  <h2 class="h2 px-5 py-0 mb-3 text-2xl font-bold">
    {activeItem.title} Module
  </h2>
  <hr>
  {#if activeItem && activeItem.items?.length}
    {#each activeItem.items as item}
      {#if item.type=='link'}
        <a href={item.url} 
          class="w-full block p-3 px-5 hover:bg-slate-300 rounded-md"
          class:active={item.name==activeSubitem.name}
        >
          {item.title}
        </a>
      {:else}
        <hr class="my-5 mx-3" />
      {/if}
    {/each}
  {/if}
</div>

<style lang="postcss">
  .active {
    @apply bg-primary-500
  }
</style>
