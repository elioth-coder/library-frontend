<script>
  import { Avatar, Heading, Table, TableBody, TableBodyCell, TableBodyRow } from "flowbite-svelte";
  import SidebarDrawer from "./SidebarDrawer.svelte";
  import Header from "./Header.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import { onMount } from "svelte";
  import MemberService from "../services/MemberService";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import Footer from "./Footer.svelte";

  const { HOST } = CONFIG;
  let crumbs = [
    {
      href: '#/',
      title: 'Profile',
    },
  ];
  let memberService = new MemberService();
  let userService = new UserService();

  let hideDrawer = true;
  let member;

  onMount(async () => {
    let user = await userService.me();

    if(user.role == 'Admin') {
      replace('#/');
    }

    member = await memberService.getOne('user_id', user.id);
  })
</script>

<div class="flex flex-col min-h-screen">
  <SidebarDrawer bind:hideDrawer={hideDrawer} />
  <Header on:hide-drawer={() => (hideDrawer = false)} />
  <section class="p-3 pb-0">
    <Breadcrumb {crumbs} />
  </section>
  <main class="flex flex-col" style="min-height: calc(100vh - 300px);">
    <Heading tag="h4" class="text-center font-semibold mb-4">Profile</Heading>
    <div class="flex flex-col">
      {#if member}
      {@const colors = {'Approved': 'green', 'Pending': 'yellow', 'Rejected': 'red'}}
      {@const status_color = colors[member.status]}
      <section class="flex flex-col items-center">
          <Avatar src={`${HOST}/static/uploads/${member.photo}`} rounded size="xl"/>
          <div class="w-full h-96">
            <Table>
              <TableBody>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Status</TableBodyCell>
                  <TableBodyCell>
                    <Heading tag="h6" class="text-{status_color}-500">{member.status}</Heading>
                  </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Role</TableBodyCell>
                  <TableBodyCell>{member.type}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Card No.</TableBodyCell>
                  <TableBodyCell>{member.card_number}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Name</TableBodyCell>
                  <TableBodyCell>{member.first_name} {member.last_name}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Gender</TableBodyCell>
                  <TableBodyCell>{member.gender}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Birthday</TableBodyCell>
                  <TableBodyCell>{member.birthday}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Year &amp; Course</TableBodyCell>
                  <TableBodyCell>
                    {#if member.type=='Student'}
                      {member.course} {member.year_level}
                    {:else}
                      N/A
                    {/if}
                  </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Campus</TableBodyCell>
                  <TableBodyCell>{member.campus}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Email Address</TableBodyCell>
                  <TableBodyCell>{member.email}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Issue Date</TableBodyCell>
                  <TableBodyCell>{member.issue_date}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableBodyCell class="font-semibold text-right">Expiration Date</TableBodyCell>
                  <TableBodyCell>{member.expiration_date}</TableBodyCell>
                </TableBodyRow>
              </TableBody>
            </Table>
          </div>
        </section>
      {:else}
        <h1 class="text-center">Loading...</h1>
      {/if}
    </div>
  </main>
  <section class="w-full mt-5 -mb-5">
    <Footer />
  </section>
</div>