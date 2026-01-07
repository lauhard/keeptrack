<script lang="ts">
	import "../main.css";
	import favicon from "$lib/assets/favicon.svg";
	import Navigation from "$lib/components/Navigation.svelte";
	import { routes } from "$lib/routes";
	import type { User } from "../app";
	import type { Snippet } from "svelte";
	import Aside from "$lib/components/Aside.svelte";
	let { data, children }: { data: { user: User }; children: Snippet } =
		$props();

	let innerWidth = $state<number>(0);
	let showState = $state<boolean>(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<svelte:window bind:innerWidth />
<div class="app">
	<main>
		<header>
			{#if innerWidth < 600}
				<Aside bind:showState={showState} {routes} user={data?.user}></Aside>
			{:else}
				<Navigation {routes} user={data?.user}></Navigation>
			{/if}
		</header>
		{@render children()}
		<footer>
			<!-- basic footer -->
			<p>KeepTrack &copy; 2026 by ALau</p>
		</footer>
	</main>
</div>
