<script>
  import { Button, Modal } from "flowbite-svelte";
  import { CheckCircleOutline, ExclamationCircleOutline } from "flowbite-svelte-icons";

  export let open = false;
  export let message;
</script>

<Modal bind:open size="xs" autoclose>
  <div class="text-center">
    {#if message.type=='error'}
      <ExclamationCircleOutline
        class="mx-auto mb-4 text-{message.type='success' ? 'green' : 'red'}-400 w-12 h-12 dark:text-{message.type='success' ? 'green' : 'red'}-200"
      />
    {/if}
    {#if message.type=='success'}
      <CheckCircleOutline
        class="mx-auto mb-4 text-{message.type='success' ? 'green' : 'red'}-400 w-12 h-12 dark:text-{message.type='success' ? 'green' : 'red'}-200"
      />
    {/if}
    <h3 class="mb-5 text-lg font-normal text-{message.type='success' ? 'green' : 'red'}-500 dark:text-{message.type='success' ? 'green' : 'red'}-400">
      {message.text}
    </h3>
    <Button color={message.type='success' ? 'green' : 'red'} class="me-2">OK</Button>
  </div>
</Modal>
