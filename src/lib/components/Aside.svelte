<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { authClient } from "$lib/betterauth/auth-client";
    import type { Route } from "$lib/routes";
    import { page } from "$app/state";
    import type { User } from "../../app";
    import { LucideChefHat } from "@lucide/svelte";
    let {
        showState = $bindable(false),
        routes,
        user,
        className,
    }: {
        showState?: boolean;
        routes: Route[];
        user?: User | null;
        className?: string;
    } = $props();

    const signout = async () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: async () => {
                    await invalidateAll();
                    goto("/");
                },
            },
        });
    };
    let isActive = (routePath: string) => {
        if (
            page.url.pathname == routePath ||
            (page.url.pathname.includes(toLower(routePath)) &&
                toLower(routePath) != "/")
        ) {
            return true;
        }
    };
    const toLower = (v: string) => v.toLowerCase();
    const routePath = (v: string) => v.split("/").length - 1;
</script>

<nav class="${className} main-aside" data-sveltekit-preload-data="tap">
    <ul class="logo-wrapper">
        <li>
            <a href="/">
                <!-- <img class="main-logo" src="" alt="Tennis Club Ponfeld"> -->
                <LucideChefHat size="var(--logo-size}" strokeWidth={1.5}
                ></LucideChefHat>
            </a>
        </li>
    </ul>
    <ul>
        {#each routes as route}
            {#if route.public === true}
                {@render subroute(route, routePath(route.path))}
            {:else if route.public === false && user?.id}
                {#if route.role === user?.role}
                    {@render subroute(route, routePath(route.path))}
                {:else if route.role === user?.role}
                    {@render subroute(route, routePath(route.path))}
                {/if}
            {/if}
        {/each}
    </ul>
    <ul class="auth-links">
        {#if user}
            <li>
                <button class="btn-logout" onclick={signout}>Sign Out</button>
            </li>
        {:else}
            <li class:active={isActive("/auth/login")}>
                <a class="" href="/auth/login">Login</a>
            </li>
        {/if}
    </ul>
</nav>

{#snippet subroute(route: Route, index?: number)}
    <li class:active={isActive(route.path)} data-route-level={index ?? 0}>
        <a href={route.path}>{route.name}</a>
        {#if route.subRoutes}
            <div class="sub-routes-container sub-routes-container-{index}">
                <ul class="sub-routes sub-routes-{toLower(route.name)}">
                    {#each route.subRoutes as subRoute}
                        {#if subRoute.public === true}
                            {@render subroute(subRoute, index ? index + 1 : 1)}
                        {:else if subRoute.public === false && user?.id}
                            {#if subRoute.role === user?.role}
                                {@render subroute(
                                    subRoute,
                                    index ? index + 1 : 1,
                                )}
                            {:else if subRoute.role === user?.role || subRoute?.role === "user" || subRoute?.role === undefined}
                                {@render subroute(
                                    subRoute,
                                    index ? index + 1 : 1,
                                )}
                            {/if}
                        {/if}
                    {/each}
                </ul>
            </div>
        {/if}
    </li>
{/snippet}

<style>
    .main-aside {
        background-color: var(--color-ld-black-500);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0%;
        z-index: 9999;
        overflow-y: scroll;
        .logo-wrapper {
            width: 100px;
            height: 100px;
            li {
                width: 50%;
            }
        }
        ul,
        li,
        a {
            color: white;
            text-transform: capitalize;
            text-decoration: none;
            font-size: 1.3rem;
            width: 100%;
        }
        .sub-routes-container,
        .sub-routes {
            width: 100%;
        }
        li {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: end;
        }
        a {
            width: 100%;
            text-align: end;
            transition: all ease-in-out 200ms;
        }

        li[data-route-level="1"] {
            > a {
                font-weight: bold;
            }
        }
        ul:has(li[data-route-level="1"]) {
        }
        li:has(.sub-routes-container) {
            > a {
                font-weight: bold;
            }

            padding-right: 0.5rem;

            .sub-routes-container {
                padding-right: 1rem;
                width: 100%;
                a {
                    padding-right: 1rem;
                }
            }
        }

        /* Border-bottom only on last li within sub-routes */
        .sub-routes > li:last-child:not(:has(.sub-routes)) {
        }
        li:hover {
            > a {
                background-color: var(--color-ld-accent-500);
            }
            > .sub-routes-container {
                border-right: 1px solid var(--color-ld-accent-500);
                width: 100%;
                a {
                    padding-right: 1rem;
                }
            }
        }
        a:hover {
            &:not(.logo-wrapper > li > a) {
                margin-right: 1rem;
                font-weight: bold;
                transition: all ease-in-out 200ms;
            }
        }
    }
</style>
