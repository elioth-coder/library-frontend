<script>
  import { Button, Input, Modal } from 'flowbite-svelte';
  import { ProfileCardOutline } from 'flowbite-svelte-icons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const handleSubmit = (e) => {
    let form = e.target;
    let formData = new FormData(form);

    let card_number = formData.get('card_number');
    dispatch('card-scan', card_number);
    dispatch('close');
  }
</script>

<Modal size="xs" title="Enter/scan card number" open={true} autoclose>
  <form on:submit|preventDefault={handleSubmit}>
    <Input type="text" name="card_number" placeholder="--card number--">
      <ProfileCardOutline slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </Input>
  </form>
  <svelte:fragment slot="footer">
    <section class="w-full text-right">
      <Button color="alternative">Close</Button>
    </section>
  </svelte:fragment>
</Modal>