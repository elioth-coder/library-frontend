<script>
  import { Button, Modal } from "flowbite-svelte";
  import { CloseOutline, CheckCircleOutline, ExclamationCircleOutline } from "flowbite-svelte-icons";

  export let open = false;
  export let message;

  let color;
  let colors = {'error': 'red', 'success': 'green', 'warning': 'yellow'};

  $: {
    color = colors[message.type];
  }

</script>

<Modal {color} title={message.type.toUpperCase()} bind:open size="xs" autoclose on:close>
  <div class="text-center">
    {#if message.type=='warning'}
      <ExclamationCircleOutline
        class="mx-auto mb-4 text-yellow-500 w-12 h-12 dark:text-yellow-300"
      />
    {/if}
    {#if message.type=='error'}
      <CloseOutline
        class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-300"
      />
    {/if}
    {#if message.type=='success'}
      <CheckCircleOutline
        class="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-red-300"
      />
    {/if}
    <p>
      {@html message.text}
    </p>
  </div>
  <svelte:fragment slot="footer">
    <section class="text-right w-full">
      <Button {color}>Close</Button>
    </section>
  </svelte:fragment>
</Modal>
