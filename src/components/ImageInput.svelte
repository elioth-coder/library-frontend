<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { CameraFotoSolid, CloseSolid } from "flowbite-svelte-icons";
  export let height = "250px";
  export let photo = "";
  export let error = null;
  export let required = false;
  export let name = "photo";

  let file;

  const browseImage = () => {
    file.click();
  };

  const removePhoto = () => {
    photo = "";
  };

  $: if (photo == "") {
    let photoElement = document.getElementById("photo");
    // @ts-ignore
    if (!photo && photoElement) photoElement.value = null;
  }

  const dispatch = createEventDispatcher();

  onMount(async () => {
    file.onchange = (e) => {
      let files = e.target.files
      
      if(files.length) {
        const FR = new FileReader();

        FR.addEventListener("load", function (evt) {
          // @ts-ignore
          photo = evt.target.result;
        });

        FR.readAsDataURL(files[0]);
      }
    };
  });
</script>

<div
  class="camera-input overflow-hidden flex items-center justify-center relative w-full rounded-md border text-center"
  class:border-danger={error}
  style:height
>
  <input
    type="text"
    {required}
    value={photo}
    class="p-0 m-0"
    style="height:1px; opacity: 0.01; width: 0; margin-left: -1px;"
  />
  {#if photo}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={photo} style="height: 100%;" alt="Photo" class="block" />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={removePhoto}
      class="text-sm py-1 px-2 border rounded photo-icon absolute remove"
    >
      <CloseSolid size="sm" />
    </div>
  {:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={browseImage}
      class="text-sm py-1 px-2 border rounded photo-icon absolute"
    >
      <CameraFotoSolid size="sm" />
    </div>
  {/if}
  <input type="hidden" {name} value={photo} />
  <input type="file" bind:this={file} style="display: none;" />
</div>

<style>
  .camera-input .remove {
    display: none;
  }

  .camera-input:hover .remove {
    display: block;
  }

  .photo-icon {
    cursor: pointer;
    color: #555;
    background-color: #fff;
  }

  .photo-icon:hover {
    background-color: #eee;
    color: #000;
  }
</style>
