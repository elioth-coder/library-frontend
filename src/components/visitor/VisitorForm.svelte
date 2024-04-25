<script>
  // @ts-nocheck

  import { Input, Label, Select } from "flowbite-svelte";
  import CameraInput from "../CameraInput.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { shortDate } from "../../helpers/DateFormatter";
  import VisitorPhotoService from "../../services/VisitorPhotoService";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, first_name, last_name, type, registration_date, photo;
  let visitor_types = [
    { value: 'Visitor', name: 'Visitor' },
    { value: 'Faculty', name: 'Faculty' },
    { value: 'Student', name: 'Student' },
  ];
  let { HOST } = CONFIG;
  let visitorPhotoService = new VisitorPhotoService();

  $: if (Boolean(item)) {
    id = item.id;
    first_name = item.first_name;
    last_name = item.last_name;
    type = item.type;
    registration_date = item.registration_date;
  }

  async function loadImageToBase64(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        let base64Data = canvas.toDataURL("image/jpeg"); 

        resolve(base64Data);
      };

      img.onerror = function (error) {
        reject("Error loading image: " + error);
      };

      img.src = url;
    });
  }

  onMount(async () => {
    if(item) {
      item.photo = await visitorPhotoService.getOne('visitor_id', item.id);

      if(item?.photo) {
        photo = await loadImageToBase64(`${HOST}/static/uploads/${item.photo.file}`);
      }
    }
    
  });
</script>

<form
  enctype="multipart/form-data"
  method="post"
  id="visitor_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
<input value={id ?? ""} type="hidden" name="id" id="id" />
{#if item?.photo}
  <input value={item.photo.id ?? ""} type="hidden" name="visitor_photo_id" id="visitor_photo_id" />
{/if}
<button type="submit" class="hidden"></button>
  <div class="w-1/2 mx-auto mb-2">
    {#if photo}
      <CameraInput required="true" {photo} />
    {:else}
      <CameraInput required="true" />
    {/if}
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="first_name" class="mb-2">First Name</Label>
      <Input
        disabled={processing}
        value={first_name ?? ""}
        type="text"
        name="first_name"
        id="first_name"
        placeholder="Enter first name"
        required
      />
    </div>
    <div>
      <Label for="last_name" class="mb-2">Last Name</Label>
      <Input
        disabled={processing}
        value={last_name ?? ""}
        type="text"
        id="last_name"
        name="last_name"
        placeholder="Enter last name"
        required
      />
    </div>
    <div>
      <Label for="type" class="mb-2">Visitor type</Label>
      <Select 
        id="type"
        name="type" 
        class="mt-2" 
        items={visitor_types} 
        value={type ?? ""} 
      />
    </div>
    <div>
      <Label for="registration_date" class="mb-2">Registration date</Label>
      <Input
        disabled={processing}
        value={registration_date ?? shortDate(new Date())}
        type="date"
        id="registration_date"
        name="registration_date"
        placeholder="Enter registration date"
        required
      />
    </div>
  </div>
</form>
