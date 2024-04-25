<script>
// @ts-nocheck

  import { Input, Label } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { shortDate } from "../../helpers/DateFormatter";
  import VisitorService from "../../services/VisitorService";
  import DropdownSearch from "../DropdownSearch.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let processing;
  let id, card_number, email, visitor_id, issue_date, expiration_date;
  let visitor_options = [];
  
  $: if (Boolean(item)) {
    id = item.id;
    card_number = item.card_number;
    email = item.email;
    visitor_id = item.visitor_id;
    issue_date = item.issue_date;
    expiration_date = item.expiration_date;
  }

  onMount(async () => {
    let service = new VisitorService();
    let visitors = await service.getAll();

    if(visitors.length) {
      visitor_options = visitors.map(
        visitor => ({ value: visitor.id, text: `${visitor.first_name} ${visitor.last_name}` })
      );
    }
  });
</script>

<form
  id="library_card_form"
  on:submit|preventDefault={(e) => dispatch("submit", new FormData(e.target))}
>
  <input value={id ?? ""} type="hidden" name="id" id="id" />
  <button type="submit" class="hidden"></button>
  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <Label for="card_number" class="mb-2">Card number</Label>
      <Input
        disabled={processing}
        value={card_number ?? ""}
        type="text"
        name="card_number"
        id="card_number"
        placeholder="Enter card number"
        required
      />
    </div>
    <div>
      <Label for="email" class="mb-2">Email address</Label>
      <Input
        disabled={processing}
        value={email ?? ""}
        type="email"
        name="email"
        id="email"
        placeholder="Enter email address"
        required
      />
    </div>
    <div class="col-span-2">
      <Label for="visitor_id" class="mb-2">Visitor</Label>
      {#if visitor_options.length}
        <DropdownSearch value={visitor_id ?? ""} name="visitor_id" options={visitor_options} />
      {:else}
        <DropdownSearch name="book_id" options={[]} />
      {/if}  
    </div>
    <div>
      <Label for="issue_date" class="mb-2">Issue date</Label>
      <Input
        disabled={processing}
        value={issue_date ?? shortDate(new Date())}
        type="date"
        id="issue_date"
        name="issue_date"
        placeholder="Enter issue date"
        required
      />
    </div>
    <div>
      <Label for="expiration_date" class="mb-2">Expiration date</Label>
      <Input
        disabled={processing}
        value={expiration_date ?? shortDate(new Date())}
        type="date"
        id="expiration_date"
        name="expiration_date"
        placeholder="Enter expiration date"
        required
      />
    </div>
  </div>
</form>
