<script>
    import { Button, Modal, Spinner } from "flowbite-svelte";
    import { QuestionCircleOutline } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let open = false;
    export let message;
    export let confirmButtonText = "Yes, proceed";
    export let cancelButtonText = "No, cancel";
    export let processing;
  </script>
  
  <Modal bind:open={open} size="xs" dismissable={!processing}>
    <div class="text-center">
      <QuestionCircleOutline
        class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
      />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        {message}
      </h3>
      <Button disabled={processing} on:click={() => dispatch('proceed')} color="red" class="me-2">
        {#if processing}<Spinner size={4} class="me-1" />{/if}
        {confirmButtonText}
      </Button>
      <Button disabled={processing} on:click={() => dispatch('cancel')} color="alternative">
        {cancelButtonText}
      </Button>
    </div>
  </Modal>
  