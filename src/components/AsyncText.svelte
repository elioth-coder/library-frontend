<script>
  export let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('Loaded.'), 3000);
  });
  export let placeholder = 'Loading...';
  export let classes = 'text-base';
</script>

<span class={classes}>
  {#await promise}
    {placeholder}
  {:then result}
    {result}
  {/await}
</span>