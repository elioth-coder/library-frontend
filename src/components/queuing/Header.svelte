<script>
  import { Button, DarkMode, NavBrand, Navbar } from "flowbite-svelte";
  import { CartSolid } from "flowbite-svelte-icons";
  import cart_items from "../../stores/CartItemsStore";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<header
  class="sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
>
  <Navbar color="default">
    <div class="flex w-fit items-center justify-start">
      <NavBrand href="#/queuing" class="ms-2 md:me-24">
        <img src="/src/logo.png" class="me-3 h-6 sm:h-8" alt="Stacked books" />
        <span
          class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
        >
          NEUST Library Queuing
        </span>
      </NavBrand>
    </div>

    <div class="ms-auto flex items-center gap-2 p-1">
      <!-- <AppsMenu /> -->
      {#if $cart_items?.length}
        <Button
          color="dark"
          class="border-none"
          outline
          size="xs"
          on:click={() => dispatch("open-cart")}
        >
          <CartSolid class="w-5 h-5 me-1" />
          {$cart_items.length} item{$cart_items.length > 1 ? "s" : ""}
        </Button>
      {/if}
      <DarkMode />
      <Button
        color="dark"
        class="border-none"
        outline
        size="xs"
        href="#/sign-in/"
      >
        Sign in
      </Button>
    </div>
  </Navbar>
</header>
