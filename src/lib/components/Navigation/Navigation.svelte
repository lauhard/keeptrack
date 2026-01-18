<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { authClient } from "$lib/betterauth/auth-client";
    import { routes, type Route } from "$lib/components/Navigation/routes";
    import { resolve } from "$app/paths";
    import {
        checkSubRoutes,
        getRouteLevel,
        showRoute,
        type NavProps,
    } from "$lib/components/Navigation";

    import "$lib/components/Navigation/nav.base.css";
    import {
        LucideHamburger,
    } from "@lucide/svelte";
    import { getUserState } from "$lib/app-state/user.svelte";

    let userState = $state(getUserState());
    let { navProps }: { navProps?: NavProps | null; className?: string } =
        $props();

    let navPosition = $derived(navProps?.navPosition);
    let linkPosition = $derived(navProps?.linkPosition);
    let navHeight = $derived(navProps?.navHeight ?? 0);

    let routeLevels = $derived<string>(
        (checkSubRoutes(routes) * navHeight).toString(),
    );
    let innerWidth = $state<number>(700);

</script>

<svelte:window bind:innerWidth />

{#snippet GetIconFromRoute(route: Route)}
    {#if route?.icon != undefined}
        {@const Icon = route.icon}
        <Icon size="1.5rem" />
    {/if}
{/snippet}

{#snippet RenderRoute(route: Route, index: number)}
    {#if showRoute(userState.userInfo, route)}
        <li
            class="route"
            data-hasChildren={route?.subRoutes ? "true" : "false"}
            data-route-name={route.name}
            data-index={index}
        >
            <a class="route-link" href={resolve(route.path as any)}>
                <span
                    ><icon>{@render GetIconFromRoute(route)}</icon
                    >{route.name}</span
                >
            </a>
            {#if route.subRoutes}
                <ul class="sub-routes">
                    {@render RenderRoutes(route.subRoutes)}
                </ul>
            {/if}
        </li>
    {/if}
{/snippet}

{#snippet RenderRoutes(routes: Route[])}
    {#each routes as route}
        {#if route?.path != undefined}
            {@render RenderRoute(route, getRouteLevel(route.path))}
        {/if}
    {/each}
{/snippet}

<nav
    class="nav"
    class:top={navPosition === "top"}
    class:bottom={navPosition === "bottom"}
    style="--bg-height: {routeLevels}%; --nav-height: {navHeight}px;"
>
    {#if innerWidth > 600}
        <ul
            class="main-routes"
            class:center={linkPosition === "center"}
            class:left={linkPosition === "left"}
            class:right={linkPosition === "right"}
        >
            {@render RenderRoutes(routes)}
        </ul>
    {:else}
        <ul class="auth">
            <li>
                <button class="btn btn-login">
                    <LucideHamburger></LucideHamburger>
                </button>
            </li>
        </ul>
    {/if}
</nav>

<style>
</style>
