<script lang="ts">
    import { getUserState } from "$lib/app-state/user.svelte";
    import {
        accountRoutes,
        type Route,
    } from "$lib/components/Navigation/routes";
    import { getRouteLevel, showRoute } from "$lib/components/Navigation";
    import { resolve } from "$app/paths";
    import { LucideLogIn, LucideLogOut, LucideX } from "@lucide/svelte";
    import { signout } from "$lib/betterauth/auth-client";

    let { showState = $bindable(false) } = $props<{
        showState: boolean;
    }>();

    let userState = $state(getUserState());

    $effect(() => {
        console.log("showState", showState);
        console.log("is authenticated ", userState.isAuthenticated());
    });
</script>

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
                {@render GetIconFromRoute(route)}
                {route.name}
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

<nav class="aside" class:open={showState === true}>
    <button class="btn btn-close"
        onclick={() => {
            showState = false;
        }}><LucideX size="1rem"></LucideX></button
    >
    <ul class="aside-routes">
        {@render RenderRoutes(accountRoutes)}
        <li class="route">
            {#if userState.isAuthenticated()}
                <button
                    class="btn btn-logout"
                    onclick={() => {
                        signout();
                        showState = false;
                    }}
                >
                    <LucideLogOut ></LucideLogOut>
                </button>
            {/if}
        </li>
    </ul>
</nav>

<style>
    .aside {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100svh;
        width: 40svw;
        min-width: 250px;
        max-width: 350px;
        transform: translateX(400px);
        background-color:var(--color-black-300);
        z-index: 20;
        transition: all 300ms ease-in-out;
        .aside-routes {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-top: 5rem;
            align-items: center;
            .route,
            .route-link {
                width: 100%;
                min-height: 40px;
                .route-link {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row-reverse;
                    justify-content: end;
                    color: var(--color-white-500);
                }
            }
            .route{
                margin-right: 5rem;
            }
            .route:has(.btn) {
                .btn {
                    margin-right: .5rem;
                    justify-self: end;
                }
            }
            .route-link:hover {
                color: var(--color-ld-accent-500);
            }
        }
        .btn-close{
            color:var(--color-white-500);
            border-color:var(--color-white-500);
            border-radius: 100vw;
            width: 35px;
            height: 35px;
            padding: 0;
            margin: 1rem;
            &:hover{
                color:var(--color-ld-accent-500);
                border-color:var(--color-ld-accent-500);
            }
        }
    }
    .open {
        transform: translateX(0svw);
        transition: all 300ms ease-in-out;
    }
</style>
