<script>
  import BookCopyService from "../../services/BookCopyService";
  import Toast from "../Toast.svelte";
  import ConfirmationPopup from "../ConfirmationPopup.svelte";
  import BookCopyCrudTable from "./BookCopyCrudTable.svelte";
  import BookCopyForm from "./BookCopyForm.svelte";
  import FormContainerModal from "../FormContainerModal.svelte";
  import { Button } from "flowbite-svelte";

  let table_name = "book_copy";
  let service = new BookCopyService();
  let modalSize = "md";

  let asyncItems = service.getAll();

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
      await service.delete(selectedItem.id);
      selectedItem = null;

      setTimeout(async () => {
        closePopup();
        notification = {
          position: "top-right",
          status: "success",
          message: `Successfully deleted the ${table_name.replace("_", " ")}`,
        };
        asyncItems = service.getAll();
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
      if (Boolean(formData.get("id"))) {
        await service.update(formData);
        _notification.message = `Successfully updated ${table_name.replace("_", " ")}`;
      } else {
        await service.add(formData);
        _notification.message = `Successfully added ${table_name.replace("_", " ")}`;
      }

      setTimeout(async () => {
        closeModal();
        notification = { ..._notification };
        asyncItems = service.getAll();
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
    asyncItems = service.search(query);
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

<div class="w-full text-right z-50" style="margin-bottom: -20px;">
  <Button on:click={() => addItem()}>Add new copy</Button>
</div>
<BookCopyCrudTable
  {asyncItems}
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
  <BookCopyForm {processing} item={selectedItem} on:submit={submitItem} />
</FormContainerModal>
