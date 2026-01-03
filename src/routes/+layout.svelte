<script lang="ts">
	import '../main.css'
	import favicon from '$lib/assets/favicon.svg';
    import Navigation from '$lib/components/Navigation.svelte';
    import { routes } from '$lib/routes';
    import type { User } from '../app';
    import type { Snippet } from 'svelte';
	let { data, children }:{ data: { user: User}, children: Snippet} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<main>
		<header>
			<Navigation routes={routes} user={data?.user}></Navigation>
		</header>
		{@render children()}
		<footer>
			<!-- basic footer -->
			 <p>KeepTrack &copy; 2026 by ALau </p>
		</footer>
	</main>
</div>

