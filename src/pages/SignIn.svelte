<script lang="ts">
  import {
    Label,
    Input,
    Button,
    Card,
    Alert,
    Spinner,
    P,
    A,
  } from "flowbite-svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import { InfoCircleSolid, UserCircleOutline } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  export let site = {
    name: "NEUST Library",
    img: "/src/logo.png",
    link: "/",
    imgAlt: "Library Logo",
  };
  export let mainClass = "bg-gray-50 dark:bg-gray-900 w-full";
  export let mainDivClass =
    "flex flex-col items-center justify-center px-6 mx-auto h-screen dark:bg-gray-900";
  export let siteLinkClass =
    "flex items-center justify-center mb-1 text-2xl font-semibold dark:text-white";
  export let siteImgClass = "mr-4 h-11";
  let error = null;
  let processing = false;
  let userService = new UserService();

  const dismissError = async () => {
    error = null;
  };

  const handleSubmit = async (e) => {
    processing = true;
    let form = e.target;
    let formData = new FormData(form);

    try {
      let user = await userService.login(formData);
      processing = false;

      if (user) {
        return replace("/");
      }
    } catch (e) {
      error = e;
      processing = false;
    }
  };

  onMount(async () => {
    try {
      const user = await userService.me();

      if (user) {
        console.log(user);
        return replace("/");
      }
    } catch (e) {}
  });
</script>

<main class={mainClass}>
  <Button
    class="border-none absolute top-2 right-2 hidden sm:inline-block"
    outline
    size="sm"
    href="#/queuing/"
  >
    Queuing System
    &rarr;
  </Button>

  <div class={mainDivClass}>
    <Card class="w-full">
      <a href={site.link} class={siteLinkClass}>
        <img src={site.img} class={siteImgClass} alt={site.imgAlt} />
        <span>{site.name}</span>
      </a>
      <UserCircleOutline class="mx-auto h-28 w-28" size="lg" />
      <!-- <hr class="my-3" /> -->
      <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
        <div>
          <Label for="username" class="mb-2">Your username</Label>
          <Input
            disabled={processing}
            type="text"
            name="username"
            id="username"
            placeholder="username"
            required
          />
        </div>
        <div>
          <Label for="password" class="mb-2">Your password</Label>
          <Input
            disabled={processing}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>
        <hr class="mt-5" />
        <section class="grid grid-cols-2 gap-3">
          <Button outline type="submit" disabled={processing}>
            {#if processing}
              <Spinner size={4} class="mr-2" />
            {/if}
            Login
          </Button>
          <Button outline color="green" href="#/sign-up">Register</Button>
        </section>
      </form>
    </Card>
    {#if error}
      <div class="max-w-sm w-full mt-3">
        <Alert
          on:close={dismissError}
          defaultClass="p-4 gap-3 text-sm min-w-full max-w-sm"
          color="red"
          dismissable
        >
          <InfoCircleSolid slot="icon" class="w-4 h-4" />
          {error.message}
        </Alert>
      </div>
    {/if}
  </div>
</main>
