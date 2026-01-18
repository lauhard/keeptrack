<script lang="ts">
    import type { NavProps } from "./Navigation";
    import Navigation from "./Navigation/Navigation.svelte";
    import Aside from "./Aside.svelte";
    import Avatar from "./Avatar.svelte";

    let showState = $state(false);
    let navProps = $derived<NavProps>({
        linkPosition: "center",
        navPosition: "top",
        navHeight: 80,
    });

    $effect(() => {
        console.log("showState", showState);
    });
</script>

<header>
    <Navigation {navProps}></Navigation>
    <Avatar bind:showState></Avatar>
</header>
<Aside bind:showState={showState}></Aside>

<style>
    header {
        position: relative;
        height: var(--header-height);
        width: 100%;
        z-index: 1;
    }
</style>
