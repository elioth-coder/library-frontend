<script>
  import { Button, Modal, Spinner } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let processing;
  export let table_name;
  export let open;
  export let modalSize;
</script>

<Modal
  dismissable={!processing}
  title={table_name.replace('_', ' ').toUpperCase()}
  bind:open
  on:close={() => dispatch("cancel")}
  size={modalSize}
>
  <slot />
  <svelte:fragment slot="footer">
    <Button on:click={() => dispatch("proceed")} disabled={processing}>
      {#if processing}
        <Spinner size={4} class="me-1" />
      {/if}
      Submit
    </Button>
    <Button
      on:click={() => dispatch("cancel")}
      disabled={processing}
      color="alternative"
    >
      Cancel
    </Button>
  </svelte:fragment>
</Modal>
