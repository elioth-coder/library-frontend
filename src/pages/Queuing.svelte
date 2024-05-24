<script>
  import "../app.pcss";
  import { onMount } from "svelte";
  import UserService from "../services/UserService";
  import { Hr, P, Heading, List, Li } from "flowbite-svelte";
  import Header from "../components/queuing/Header.svelte";
  import Footer from "../components/queuing/Footer.svelte";
  import SearchForm from "../components/queuing/SearchForm.svelte";
  import CartItemsModal from "../components/queuing/CartItemsModal.svelte";

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
    <Heading tag="h3" class="mb-2">Library Queuing System</Heading>
    <P class="text-justify leading-loose" style="text-indent: 50px;">
      An in-house developed library queuing system for the Nueva Ecija University of Science and Technology.
      This system lets patrons use a computer terminal to select books for checkout and receive a printed receipt 
      with a queue number and reference number for their selected books.
      With this system the patrons will need to present their receipt and library card for book checkout.
    </P>

    <br>
    <Heading tag="h4" class="mb-2">Process Flow</Heading>
    <List tag="ol" class="space-y-1 text-gray-500 dark:text-gray-400">
      <Li>
        Book Selection
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>Patrons use computer terminals to search the library catalog and select the books they want to check out.</Li>
          <Li>Once selections are made, the system generates a reference number for the selected books.</Li>
        </List>
      </Li>
      <Li>
        Queue Number Generation
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>The system sends the reference number to a receipt printer.</Li>
          <Li>The receipt printer prints a receipt with a unique queue number and the reference number for the selected books.</Li>
        </List>
      </Li>
      <Li>
        Waiting Area
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>Patrons wait in a designated waiting area until their queue number is called.</Li>
        </List>
      </Li>
      <Li>
        Checkout
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>When the queue number is displayed or called, patrons go to the checkout desk.</Li>
          <Li>They present their receipt with the queue number and reference number to the librarian or staff.</Li>
          <Li>The staff retrieves the selected books using the reference number and completes the checkout process.</Li>
        </List>
      </Li>
    </List>

    <br>
    <Heading tag="h4" class="mb-2">Benefits</Heading>
    <List tag="ol" class="space-y-1 text-gray-500 dark:text-gray-400">
      <Li>
        Efficiency
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>Reduces the time patrons spend at the checkout desk by pre-selecting books at the computer terminal.</Li>
          <Li>Allows staff to prepare books for checkout in advance, reducing wait times.</Li>
        </List>
      </Li>
      <Li>
        Organization
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>Organizes the flow of patrons, preventing overcrowding at the checkout desk.</Li>
          <Li>Keeps track of selected books using reference numbers, ensuring accurate checkouts.</Li>
        </List>
      </Li>
      <Li>
        Convenience
        <List tag="ul" class="ps-5 space-y-1 text-gray-500 dark:text-gray-400">
          <Li>Provides patrons with a clear indication of their place in the queue.</Li>
          <Li>Allows patrons to browse or relax while waiting for their number to be called.</Li>
        </List>
      </Li>
    </List>
  </div>
  <Footer />
</div>

<style>
  .cover-photo-container {
    max-height: 300px;
    overflow: hidden;
  }
</style>