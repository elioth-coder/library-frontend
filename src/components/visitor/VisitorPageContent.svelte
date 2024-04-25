<script>
  import Toast from "../Toast.svelte";
  import VisitorService from "../../services/VisitorService";
  import VisitorPhotoService from "../../services/VisitorPhotoService";
  import ConfirmationPopup from "../ConfirmationPopup.svelte";
  import CrudToolbar from "../CrudToolbar.svelte";
  import VisitorForm from "./VisitorForm.svelte";
  import FormContainerModal from "../FormContainerModal.svelte";
  import CrudTable from "../CrudTable.svelte";
  import LibraryCardService from "../../services/LibraryCardService";

  let table_name = "visitor";
  let columns = [
    "id",
    "first_name",
    "last_name",
    "type",
    "registration_date",
  ];
  let visitorService = new VisitorService();
  let visitorPhotoService = new VisitorPhotoService();
  let libraryCardService = new LibraryCardService();
  let modalSize = "md";

  let asyncItems = visitorService.getAll();

  let showConfirmation = false;
  let showModal = false;
  let selectedItem = null;
  let notification = null;
  let processing = false;

  const confirmDelete = (item) => {
    showConfirmation = true;
    selectedItem = item;
  };

  const cancelDelete = () => {
    showConfirmation = false;
    selectedItem = null;
  };

  const addItem = () => {
    showModal = true;
  };

  const editItem = (item) => {
    showModal = true;
    selectedItem = item;
  };

  const deleteItem = async () => {
    processing = true;
    try {
      await visitorPhotoService.deleteBy('visitor_id', selectedItem.id);
      await libraryCardService.deleteBy('visitor_id', selectedItem.id);
      await visitorService.delete(selectedItem.id);
      selectedItem = null;

      setTimeout(async () => {
        closePopup();
        notification = {
          position: "top-right",
          status: "success",
          message: `Successfully deleted the ${table_name.replace("_", " ")}`,
        };
        asyncItems = visitorService.getAll();
        await asyncItems;
      }, 100);
    } catch (e) {
      processing = false;
      notification = {
        position: "top-right",
        status: "error",
        message: e.message,
      };
    }
  };

  const submitItem = async ({ detail: formData }) => {
    processing = true;
    try {
      let _notification = {
        position: "top-right",
        status: "success",
      };
      let visitorData = new FormData();
      visitorData.set("first_name", formData.get("first_name"));
      visitorData.set("last_name", formData.get("last_name"));
      visitorData.set("type", formData.get("type"));
      visitorData.set("registration_date", formData.get("registration_date"));

      if (Boolean(formData.get("id"))) {
        visitorData.set("id", formData.get("id"));
        let visitor = await visitorService.update(visitorData);
        let visitorPhotoData = new FormData();
        visitorPhotoData.set("visitor_id", visitor.id);
        visitorPhotoData.set("visitor_photo_id", formData.get('visitor_photo_id'));
        visitorPhotoData.set("base64_file", formData.get("photo"));

        await visitorPhotoService.update(visitorPhotoData);
        _notification.message = `Successfully updated ${table_name.replace("_", " ")}`;
      } else {
        let visitor = await visitorService.add(visitorData);
        let visitorPhotoData = new FormData();
        visitorPhotoData.set("visitor_id", visitor.id);
        visitorPhotoData.set("base64_file", formData.get("photo"));

        await visitorPhotoService.add(visitorPhotoData);
        _notification.message = `Successfully added ${table_name.replace("_", " ")}`;
      }

      setTimeout(async () => {
        closeModal();
        notification = { ..._notification };
        asyncItems = visitorService.getAll();
        await asyncItems;
      }, 100);
    } catch (e) {
      processing = false;
      notification = {
        position: "top-right",
        status: "error",
        message: e.message,
      };
    }
  };

  const handleSearch = async (e) => {
    let query = e.detail;
    asyncItems = visitorService.search(query);
  };

  const submitForm = () => {
    // @ts-ignore
    document.querySelector(`#${table_name}_form button[type="submit"]`).click();
  };

  const closeModal = () => {
    selectedItem = null;
    showModal = false;
    processing = false;
  };

  const closePopup = () => {
    showConfirmation = false;
    processing = false;
  };
</script>

<CrudToolbar
  {table_name}
  on:add_item={() => addItem()}
  on:search={handleSearch}
/>

<CrudTable
  {asyncItems}
  {columns}
  on:edit={({ detail: item }) => editItem(item)}
  on:delete={({ detail: item }) => confirmDelete(item)}
/>

<ConfirmationPopup
  {processing}
  on:proceed={() => deleteItem()}
  on:cancel={() => cancelDelete()}
  message={`Are you sure you want to delete this ${table_name.replace("_", " ")}`}
  bind:open={showConfirmation}
/>

{#if notification !== null}
  <Toast {...notification} on:close={() => (notification = null)} />
{/if}

<FormContainerModal
  {table_name}
  {processing}
  {modalSize}
  bind:open={showModal}
  on:cancel={() => closeModal()}
  on:proceed={() => submitForm()}
>
  <VisitorForm {processing} item={selectedItem} on:submit={submitItem} />
</FormContainerModal>
