<script>
// @ts-nocheck

  import { Toast } from 'flowbite-svelte';
  import { CheckCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher(); 
  
  export let status;
  export let message;
  export let position = "top-right";
</script>

<Toast color="green" {position} on:close={() => dispatch('close')}>
  <svelte:fragment slot="icon">
    {#if status=='success'}
      <CheckCircleSolid class="w-5 h-5" />
      <span class="sr-only">Check icon</span>
    {:else}
      <ExclamationCircleSolid class="w-5 h-5" />
      <span class="sr-only">Error icon</span>
    {/if}
  </svelte:fragment>
  {message}
</Toast>