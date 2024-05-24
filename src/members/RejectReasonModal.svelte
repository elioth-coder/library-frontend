<script>
// @ts-nocheck
  import { Button, Modal, Spinner, Textarea } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  export let processing;
  export let member;
  export let show;

  const { HOST } = CONFIG;
  const dispatch = createEventDispatcher();

  const handleSubmit = async (e) => {
    let form = e.target;
    let formData = new FormData(form);
    formData.set('status', 'Rejected');

    dispatch('submit', formData);
  }
  let submit;
</script>

<Modal title="Reason for Rejection" bind:open={show} size="xs" class="z-10">
  <form on:submit|preventDefault={handleSubmit} class="w-full">
    <input type="hidden" name="id" value={member.id} />
    <Textarea 
      name="reason"
      rows="4"
      placeholder="Enter a reason for rejection."
    />
    <button bind:this={submit} type="submit" style="display:none;" id="submit-reason"></button>
  </form>
  <svelte:fragment slot="footer">
    <section class="text-right w-full">
      <Button
        disabled={processing}
        class="w-24"
        color="green"
        on:click={() => submit.click()}
      >
        {#if processing}
          <Spinner size={4} />
        {/if}
        Submit
      </Button>
      <Button
        disabled={processing}
        class="w-24"
        color="red"
        on:click={() => dispatch("close")}>Cancel</Button
      >
    </section>
  </svelte:fragment>
</Modal>
