<script>
  import { Avatar, Button, Modal, Spinner, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  export let processing = false;
  export let show;
  export let member;

  const { HOST } = CONFIG;
  const dispatch = createEventDispatcher();
</script>


<Modal title="Library Member Information" 
  bind:open={show} 
  size="sm"
  class="z-10"
>
  <section class="flex flex-col items-center">
    <Avatar src={`${HOST}/static/uploads/${member.photo}`} rounded size="xl"/>
    <div class="w-full h-96">
      <Table>
        <TableBody>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Member Type</TableBodyCell>
            <TableBodyCell>{member.type}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Card No.</TableBodyCell>
            <TableBodyCell>{member.card_number}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Name</TableBodyCell>
            <TableBodyCell>{member.first_name} {member.last_name}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Gender</TableBodyCell>
            <TableBodyCell>{member.gender}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Birthday</TableBodyCell>
            <TableBodyCell>{member.birthday}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Year &amp; Course</TableBodyCell>
            <TableBodyCell>
              {#if member.type=='Student'}
                {member.course} {member.year_level}
              {:else}
                N/A
              {/if}
            </TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Campus</TableBodyCell>
            <TableBodyCell>{member.campus}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Email Address</TableBodyCell>
            <TableBodyCell>{member.email}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Issue Date</TableBodyCell>
            <TableBodyCell>{member.issue_date}</TableBodyCell>
          </TableBodyRow>
          <TableBodyRow>
            <TableBodyCell class="font-semibold">Expiration Date</TableBodyCell>
            <TableBodyCell>{member.expiration_date}</TableBodyCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </div>
  </section>
  <svelte:fragment slot="footer">
    <section class="text-right w-full">
      {#if member.status=='Pending'}
        <Button outline disabled={processing} 
          class="w-24" color="green" 
          on:click={() => dispatch('approve', member)}
        >
          {#if processing}
            <Spinner size={4} />
          {/if}
          Approve
        </Button>  
        <Button outline disabled={processing} 
          class="w-24" color="red" 
          on:click={() => dispatch('reject')}
        >
        {#if processing}
          <Spinner size={4} />
        {/if}
        Reject
        </Button>  
      {:else}
        <Button color="alternative" on:click={() => dispatch('close')}>Close</Button>  
      {/if}
    </section>
  </svelte:fragment>
</Modal>
