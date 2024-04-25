<script lang="ts">
  import {
    Label,
    Input,
    Button,
    Card,
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  export let title = "Sign in to platform";
  export let site = {
    name: "Library Management",
    img: "/src/logo.png",
    link: "/",
    imgAlt: "Library Logo",
  };
  export let loginTitle = "Login to your account";
  export let mainClass = "bg-gray-50 dark:bg-gray-900 w-full";
  export let mainDivClass =
    "flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900";
  export let siteLinkClass =
    "flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white";
  export let siteImgClass = "mr-4 h-11";
  export let cardH1Class = "text-2xl font-bold text-gray-900 dark:text-white";
  let error = null;
  let processing = false;
  let userService = new UserService();

  const dismissError = async () => {
    error = null;
  }

  const handleSubmit = async (e) => {
    processing = true;
    let form = e.target;
    let formData = new FormData(form);

    try {
      let user = await userService.login(formData);
      processing = false;

      console.log({user});
      if (user) return replace("/");
    } catch (e) {
      error = e;
      processing = false;
    }
  };

  onMount(async () => {
    try {
      const user = await userService.me();

      if(user) {
        console.log(user);
        return replace('/');
      }
    } catch(e) {}
  });
</script>

<main class={mainClass}>
  <div class={mainDivClass}>
    <a href={site.link} class={siteLinkClass}>
      <img src={site.img} class={siteImgClass} alt={site.imgAlt} />
      <span>{site.name}</span>
    </a>
    <Card class="w-full">
      <h1 class={cardH1Class}>
        {title}
      </h1>
      <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
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
        <Button 
          type="submit" 
          disabled={processing}
        >
          {#if processing}
            <Spinner size={4} class="mr-2" />
          {/if}
          {loginTitle}
        </Button>
      </form>
    </Card>
    {#if error}
    <div class="max-w-sm w-full mt-3">
      <Alert on:close={dismissError} defaultClass="p-4 gap-3 text-sm min-w-full max-w-sm" color="red" dismissable>
        <InfoCircleSolid slot="icon" class="w-4 h-4" />
        {error.message}
      </Alert>
    </div>
    {/if}
  </div>
</main>
