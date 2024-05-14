<script>
  import "../app.pcss";
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import { Hr, P, Heading, List, Li } from "flowbite-svelte";
  import Header from "../components/web_opac/Header.svelte";
  import Footer from "../components/web_opac/Footer.svelte";
  import SearchForm from "../components/web_opac/SearchForm.svelte";
  import CartItemsModal from "../components/web_opac/CartItemsModal.svelte";

  let userService = new UserService();
  let user;
  let openCart = false;

  onMount(async () => {
    try {
      user = await userService.me();
    } catch (e) {}
  });
</script>

<CartItemsModal 
  {openCart} 
  on:close={() => openCart = false} 
/>

<Header 
  on:open-cart={() => openCart = true} 
/>
<div class="flex flex-col">
  <div class="cover-photo-container flex justify-center items-center">
    <img 
      src="/src/images/opac_cover.jpg" 
      alt=""
    />
  </div>
  <section class="max-w-screen-md flex mx-auto w-full pt-8">
    <SearchForm />
  </section>
  <div class="max-w-screen-lg mx-auto w-full">
    <Hr />
    <Heading tag="h3">WebOPAC</Heading>
    <P class="text-justify leading-loose" style="text-indent: 50px;">
      An in-house developed library system for the Nueva Ecija University of Science and Technology.
      <br>WebOPAC is more than a library catalog. Use this to :
    </P>
    <List tag="ul" class="space-y-1 text-gray-500 dark:text-gray-400">
      <Li>View a list of items on loan to you</Li>
      <Li>Reserve book on loan</Li>
      <Li>Find out what is on Reserve for your courses</Li>
      <Li>Find the latest titles received</Li>
      <Li>Recommend titles for purchase</Li>
    </List>
    <P class="leading-loose"><b>Please take note:</b> A library user account is required for transactions.</P>
  </div>
  <Footer />
</div>

<style>
  .cover-photo-container {
    max-height: 300px;
    overflow: hidden;
  }
</style>