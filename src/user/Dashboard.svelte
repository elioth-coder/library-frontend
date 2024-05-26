<script>
  import {  A, Button, Card, Heading, Input } from "flowbite-svelte";
  import { UserCircleOutline, ArrowUpRightFromSquareOutline, ArrowDownToBracketOutline, HeartOutline, SearchOutline } from "flowbite-svelte-icons";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import UserService from '../services/UserService';
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import Footer from "./Footer.svelte";

  let crumbs = [];
  let userService = new UserService();
  let hideDrawer = true;

  const handleSubmit = (e) => {
    let form = e.target;
    let formData = new FormData(form);

    let search = formData.get('search');
    replace(`/user/search/?query=${search}`);
  }

  let user;
  let approved = false;

  onMount(async () => {
    try {
      user = await userService.me();
      approved = (user.role=='Pending') ? false : true;
      console.log({user, approved});
    } catch (e) {
      alert(e.message);
      replace("/sign-in");
    }
  })
</script>

<div class="flex flex-col min-h-screen">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col" style="min-height: calc(100vh - 300px);">
    <Heading tag="h4" class="text-center font-semibold mb-4">Dashboard</Heading>

    {#if approved}
      <form class="p-5 pt-0 flex" on:submit|preventDefault={handleSubmit}>
        <Input type="text" name="search" placeholder="Search a book">
          <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Input>
        <Button type="submit" class="ms-1">Search</Button>
      </form>
    {/if}
    <div class="grid grid-cols-2 gap-4 px-5">
    {#if approved}
      <A href="#/user/borrowed">
        <Card>
          <ArrowUpRightFromSquareOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Borrowed</Heading>
        </Card>
      </A>
      <A href="#/user/returned">
        <Card>
          <ArrowDownToBracketOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Returned</Heading>
        </Card>
      </A>
      <A href="#/user/wishlist">
        <Card>
          <HeartOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Wishlist</Heading>
        </Card>
      </A>
    {/if}
      <A href="#/user/profile">
        <Card>
          <UserCircleOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Profile</Heading>
        </Card>
      </A>
    </div>
  </main>
  <section class="w-full mt-5 -mb-5">
    <Footer />
  </section>
</div>

