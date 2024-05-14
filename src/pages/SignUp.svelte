<script lang="ts">
  import {
    Label,
    Input,
    Button,
    Card,
    Spinner,
    Heading,
    Select,
    Hr,
  } from "flowbite-svelte";
  import UserService from "../services/UserService";
  import { replace } from "svelte-spa-router";
  import { onMount } from "svelte";
  import CameraInput from "../components/CameraInput.svelte";
  import MemberService from "../services/MemberService";
  import { format } from "date-fns";
  import MessageModal from "../components/MessageModal.svelte";
  export let mainClass = "bg-gray-50 dark:bg-gray-900 w-full";
  export let mainDivClass =
    "flex flex-col items-center justify-center px-6 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900";

  let processing = false;
  let userService = new UserService();
  let memberService = new MemberService();
  let message = null;

  const handleMessageClose = () => {
    message = null;
  }

  const handleSubmit = async (e) => {
    processing = true;
    let form = e.target;
    let formData = new FormData(form);
    let userFormData = new FormData();

    userFormData.set('username', formData.get('username'));
    userFormData.set('password', formData.get('password'));
    userFormData.set('name', `${formData.get('first_name')} ${formData.get('last_name')}`);
    userFormData.set('role', 'Pending');

    formData.delete('username');
    formData.delete('password');

    try {
      let member = await memberService.add(formData);
      let user   = await userService.add(userFormData);

      message = {
        type: 'success',
        text: 'Successfully registered! Just wait for approval',
      }

      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (e) {
      message = {
        type: 'error',
        text: e.message,
      }
    }

    processing = false;
  };

  let year_levels = [
    { value: 1, name: "1st" },
    { value: 2, name: "2nd" },
    { value: 3, name: "3rd" },
    { value: 4, name: "4th" },
  ];

  let campuses = [
    { value: "NEUST-PENARANDA", name: "Peñaranda Off-Campus" },
    { value: "NEUST-PAPAYA", name: "General Tinio (Papaya) Off-Campus" },
  ];

  let courses = [
    { value: "BSIT", name: "BSIT" },
    { value: "BSBA", name: "BSBA" },
    { value: "BSED", name: "BSED" },
    { value: "BEED", name: "BEED" },
  ];

  let member_types = [
    { value: "Faculty", name: "Faculty" },
    { value: "Student", name: "Student" },
  ];

  let gender_types = [
    { value: "Male", name: "Male" },
    { value: "Female", name: "Female" },
  ];

  onMount(async () => {
    try {
      const user = await userService.me();

      if (user) {
        console.log(user);
        return replace("/");
      }
    } catch (e) {}
  });
</script>

{#if message} 
  <MessageModal open={true} {message} on:close={handleMessageClose} />
{/if}

<main class={mainClass}>
  <div class={mainDivClass}>
    <Card size="xl">
      <Heading tag="h3">Library Registration</Heading>
      <hr class="my-3" />
      <form on:submit|preventDefault={handleSubmit}>
        <input
          type="hidden"
          name="issue_date"
          value={format(new Date(), "yyyy-MM-dd")}
        />
        <input type="hidden" name="expiration_date" value="2024-12-31" />
        <div class="flex">
          <div class="w-1/2 me-3">
            <br />
            <div class="grid gap-3 mb-3 md:grid-cols-2">
              <div>
                <Label for="first_name" class="mb-2">First name</Label>
                <Input
                  disabled={processing}
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label for="last_name" class="mb-2">Last name</Label>
                <Input
                  disabled={processing}
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div class="grid gap-3 mb-3 md:grid-cols-2">
              <div>
                <Label for="gender" class="mb-2 mt-1">Gender</Label>
                <Select
                  placeholder="Select gender"
                  id="gender"
                  name="gender"
                  class="mt-2"
                  items={gender_types}
                  required
                />
              </div>
              <div>
                <Label for="birthday" class="mb-2 mt-1">Birthday</Label>
                <Input
                  disabled={processing}
                  type="date"
                  id="birthday"
                  name="birthday"
                  required
                />
              </div>
            </div>
            <Hr hrClass="my-7" />
            <div class="grid gap-3 mb-3 grid-cols-2" style="margin-top: 25px;">
              <div>
                <Label for="year_level" class="mb-2">Year Level</Label>
                <Select
                  placeholder="Select year level"
                  id="year_level"
                  name="year_level"
                  class="mt-2"
                  items={year_levels}
                  required
                />
              </div>
              <div>
                <Label for="course" class="mb-2">Course</Label>
                <Select
                  placeholder="Select course"
                  id="course"
                  name="course"
                  class="mt-2"
                  items={courses}
                  required
                />
              </div>
            </div>
            <div class="my-5">
              <Label for="campus" class="mb-2">School or Campus</Label>
              <Select
                placeholder="Select name of campus"
                id="campus"
                name="campus"
                class="mt-2"
                items={campuses}
                required
              />
            </div>
            <div class="grid gap-3 mb-6 grid-cols-2">
              <div>
                <Label for="card_number" class="mb-2">Card number</Label>
                <Input
                  disabled={processing}
                  type="text"
                  id="card_number"
                  name="card_number"
                  placeholder="Enter card number"
                  required
                />
              </div>
              <div>
                <Label for="type" class="mb-2">Member type</Label>
                <Select
                  placeholder="Select member type"
                  id="type"
                  name="type"
                  class="mt-2"
                  items={member_types}
                  required
                />
              </div>
            </div>
          </div>
          <div class="w-1/2 ms-3 mt-6">
            <div class="w-1/2 mx-auto mb-3">
              <CameraInput height="200px" required={true} name="base64" />
            </div>
            <div class="mb-5">
              <Label for="email" class="mb-2">Email address</Label>
              <Input
                disabled={processing}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                required
              />
            </div>
            <div class="grid gap-3 mb-3 md:grid-cols-2">
              <div>
                <Label for="first_name" class="mb-2">Username</Label>
                <Input
                  disabled={processing}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label for="password" class="mb-2">Password</Label>
                <Input
                  disabled={processing}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <div class="grid gap-3 mb-3 md:grid-cols-2 pt-7">
              <Button
                size="lg"
                outline
                class="w-full"
                type="submit"
                disabled={processing}
              >
                {#if processing}<Spinner size={4} class="me-2" />{/if}
                Register
              </Button>
              <Button
                href="#/sign-in/"
                size="lg"
                outline
                color="green"
                class="w-full"
                type="submit"
                disabled={processing}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  </div>
</main>
