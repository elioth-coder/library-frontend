<script>
	// import AppsMenu from './AppsMenu.svelte';
	import UserMenu from './UserMenu.svelte';
	import { DarkMode, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';

	export let fluid = true;
	export let user;
</script>

<Navbar {fluid} color="default">
	<div class="flex w-fit items-center justify-start">
		<NavHamburger />
		<NavBrand href="/" class="ms-2 md:me-24">
			<img
				src="/src/logo.png"
				class="me-3 h-6 sm:h-8"
				alt="Stacked books"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
				NEUST Library Management
			</span>
		</NavBrand>
	</div>

	<div class="ms-auto flex items-center gap-2 p-1">
		<!-- <AppsMenu /> -->
		<DarkMode />
		<UserMenu />
	</div>
</Navbar>
