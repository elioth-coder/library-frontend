<script>
  import Layout from "../components/Layout.svelte";
  import Breadcrumb from "../components/Breadcrumb.svelte";
  import {
  Button,
    Heading,
    Hr,
    Input,
    Label,
    Select,
    Spinner,
  } from "flowbite-svelte";
  import CampusService from "../services/CampusService";
  import { onMount } from "svelte";
  import SettingService from "../services/SettingService";
  import Toast from "../components/Toast.svelte";

  let crumbs = [
    {
      href: "#/settings",
      title: "Settings",
    },
  ];

  let campusService  = new CampusService();
  let settingService = new SettingService();
  let duration_days = [];
  let campuses;
  let campus_options;
  let processing = false;

  for(let i=1; i<=15; i++) {
    duration_days.push({
      name: `${i} day${(i>1) ? "s" : ""}`,
      value: i + "",
    });
  }

  let notification = null;

  const handleSubmit = async (e) => {
    processing = true;
    let form = e.target;
    let formData = new FormData(form);

    try {
      let _notification = {
        position: "top-right",
        status: "success",
      };

      for (const [property, value] of formData.entries()) {
        let settingFormData = new FormData();
        settingFormData.set('property', property);
        settingFormData.set('value', value);

        await settingService.deleteBy('property', property);
        await settingService.add(settingFormData);
      }
      _notification.message = `Successfully updated settings`;

      setTimeout(async () => {
        notification = { ..._notification };
        processing = false;
        window.location.reload();
      }, 100);
    } catch (e) {
      processing = false;
      notification = {
        position: "top-right",
        status: "error",
        message: e.message,
      };
    }
  }

  const onChangeCampus = (e) => {
    let value = e.target.value;
    let newLocation = campuses.filter(campus => {
      return campus.name == value;
    })[0].location;
    
    location = newLocation;
  }

  let locationElement;
  let campus, borrow_duration, location, penalty_per_day, books_to_retain;

  onMount(async () => {
    let settingItems = await settingService.getAll();
    let settings = {};

    for(let i=0; i<settingItems.length; i++) {
      let item = settingItems[i];

      settings[item.property] = item.value;
    }
    
    campus = settings.campus ?? "";
    borrow_duration = settings.borrow_duration ?? "";
    location = settings.location ?? "";
    penalty_per_day = settings.penalty_per_day ?? "";
    books_to_retain = settings.books_to_retain ?? "";

    let items = await campusService.getAll();

    campuses = [...items];
    campus_options = items.map(item => {
      return { name: item.name, value: item.name };
    });
  });
</script>

<Layout>
  <main
    class="relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
  >
    <Breadcrumb {crumbs} />
    <div class="px-3">
      <Heading tag="h4" class="text-center mb-4">
        Library Settings
      </Heading>
      <Hr />
      <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-4 gap-4">
        <Label for="campus" class="text-right font-semibold mt-2">Name of campus : </Label>
        {#if campuses}
          <Select 
            placeholder="--campus--" 
            id="campus" 
            name="campus" 
            on:change={onChangeCampus}
            items={campus_options} 
            value={campus ?? ""}
          />
        {/if}
        <Label for="borrow_duration" class="text-right font-semibold mt-2">Borrow duration : </Label>
        <Select 
          placeholder="--duration days--" 
          id="borrow_duration" 
          name="borrow_duration" 
          items={duration_days} 
          value={borrow_duration ?? ""}
        />
        <Label for="location" class="text-right font-semibold mt-2">Library location : </Label>
        <input type="hidden" name="location" value={location ?? ""} />
        <Input bind:this={locationElement} 
          disabled
          placeholder="--location--" 
          id="location" 
          value={location ?? ""}
        />
        <Label for="penalty_per_day" class="text-right font-semibold mt-2">Penalty per day : </Label>
        <Input placeholder="--penalty--" 
          id="penalty_per_day" 
          type="number" 
          name="penalty_per_day" 
          value={penalty_per_day ?? ""}
        />
        <Label for="penalty_per_day" class="text-right font-semibold mt-2">Books to retain : </Label>
        <Input placeholder="--books to retain--" 
          id="books_to_retain" 
          type="number" 
          name="books_to_retain" 
          value={books_to_retain ?? ""}
        />
        <section class="col-span-4 text-right">
          <Button type="submit" disabled={processing}>
            {#if processing}
              <Spinner size={4} class="me-2" />
            {/if}
            Apply Changes
          </Button>
        </section>
      </form>
    </div>

    {#if notification !== null}
      <Toast {...notification} on:close={() => (notification = null)} />
    {/if}
  </main>
</Layout>
