<script>
  import {  A, Button, Card, Heading, Input } from "flowbite-svelte";
  import { UserCircleOutline, ArrowUpRightFromSquareOutline, ArrowDownToBracketOutline, HeartOutline, SearchOutline } from "flowbite-svelte-icons";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import UserService from '../services/UserService';
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";

  let crumbs = [];
  let userService = new UserService();
  let hideDrawer = true;

  const handleSubmit = (e) => {
    let form = e.target;
    let formData = new FormData(form);

    let search = formData.get('search');
    replace(`/user/search/?query=${search}`);
  }

  onMount(async () => {
    try {
      let user = await userService.me();
    } catch (e) {
      alert(e.message);
      replace("/sign-in");
    }
  })
</script>

<div class="flex flex-col">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col">
    <Heading tag="h4" class="text-center font-semibold mb-4">Dashboard</Heading>

    <form class="p-5 pt-0 flex" on:submit|preventDefault={handleSubmit}>
      <Input type="text" name="search" placeholder="Search a book">
        <SearchOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </Input>
      <Button type="submit" class="ms-1">Search</Button>
    </form>
    <div class="grid grid-cols-2 gap-4 px-5">
      <!-- <A href="#/user/search">
        <Card>
          <SearchOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Search</Heading>
        </Card>
      </A> -->
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
      <A href="#/user/profile">
        <Card>
          <UserCircleOutline size="xl" class="mx-auto mb-4" />
          <Heading tag="h4" class="text-center font-semibold">Profile</Heading>
        </Card>
      </A>
    </div>
  </main>
</div>