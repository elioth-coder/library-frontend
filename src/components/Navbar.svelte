<script>
	// import AppsMenu from './AppsMenu.svelte';
	import UserMenu from './UserMenu.svelte';
	import { DarkMode, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';

	export let fluid = true;
	export let user;
</script>

<Navbar {fluid} color="default">
	<div class="flex w-fit items-center justify-start">
		<NavBrand href="/" class="ms-2 md:me-24">
			<section class="h-full min-w-14">
				<img
					src="/src/logo.png"
					class="h-8"
					alt="Stacked books"
				/>
			</section>
			<span class="self-center whitespace-nowrap text-2xl font-bold dark:text-white sm:text-2xl text-black">
				NEUST Library Management
			</span>
		</NavBrand>
	</div>

	<div class="ms-auto flex items-center gap-2 p-1">
		<!-- <AppsMenu /> -->
		<DarkMode />
		<UserMenu {user} />
	</div>
</Navbar>
