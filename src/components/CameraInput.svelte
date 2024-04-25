<script>
  import { Button } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { CameraFotoSolid, CloseSolid } from "flowbite-svelte-icons";
  export let height = "250px";
  export let photo = "";
  export let error = null;
  export let required = false;
  export let name = 'photo';
  let stream;
  let openCamera = false;

  const startCamera = () => {
    openCamera = true;
    const video = document.getElementById("video");
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (mediaStream) {
        // @ts-ignore
        video.srcObject = mediaStream;
        stream = mediaStream;
      })
      .catch(function (err) {
        console.error("Error accessing webcam: ", err);
      });
  };

  const stopCamera = () => {
    openCamera = false;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    // @ts-ignore
    video.srcObject = null;
  };

  const capturePhoto = () => {
    const canvas = document.getElementById("canvas");
    // @ts-ignore
    const context = canvas.getContext("2d");
    // @ts-ignore
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // @ts-ignore
    const imageData = canvas.toDataURL("image/png");
    photo = imageData;

    stopCamera();
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
    {#if !openCamera}
      <div
        on:click={startCamera}
        class="text-sm py-1 px-2 border rounded photo-icon absolute"
      >
        <CameraFotoSolid size="sm" />
      </div>
    {/if}
  {/if}
  <input type="hidden" {name} value={photo} />
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    class:show={openCamera}
    class:hide={!openCamera}
    id="video"
    style="height: 100%;"
    autoplay
  ></video>
  <canvas id="canvas" width="640" height="480" style="display: none;"></canvas>
</div>
{#if openCamera}
  <p class="text-center mt-3 mb-0">
    <Button 
      on:click={capturePhoto} 
      type="button" 
      class="btn btn-outline-dark"
    >
      Capture Picture
    </Button>
  </p>
{/if}

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

  .show {
    display: block;
  }

  .hide {
    display: none;
  }
</style>
