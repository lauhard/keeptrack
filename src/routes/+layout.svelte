<script lang="ts">
	import "../main.css";
	import favicon from "$lib/assets/favicon.svg";
	import { type Snippet } from "svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import { setUserState } from "$lib/app-state/user.svelte";
	import type { User } from "$lib/betterauth/auth";
	let { children, data } = $props<{
		children: Snippet;
		data: { user: User };
	}>();

	let user = $derived(data.user);
	let innerWidth = $state<number>(0);
	// svelte-ignore state_referenced_locally
	let userState = setUserState(user);

	$effect(() => {
		userState?.update(user);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<svelte:window bind:innerWidth />
<div class="app">
	<Header></Header>
	<main>
		{@render children()}
	</main>
	<Footer></Footer>
</div>

<style>
	main {
		max-width: var(--content-width);
		padding-inline: var(--side);
	}
</style>
