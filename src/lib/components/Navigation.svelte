<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import { authClient } from "$lib/betterauth/auth-client";
    import type { Route } from "$lib/routes";
    import { page } from "$app/state";
    import type { User } from "../../app";
    let {
        routes,
        user,
        className,
    }: { routes: Route[]; user?: User | null; className?: string } = $props();

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

<nav class="${className} main-nav">
    <ul class="logo-wrapper">
        <li>
            <a href="/">
                <!-- <img class="main-logo" src="" alt="Tennis Club Ponfeld"> -->
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
    .main-nav {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--header-height);
        align-items: center;
        justify-content: space-between;
        flex: 1;
        z-index: 1200;
        text-transform: capitalize;
        .logo-wrapper {
            li:hover {
                background-color: transparent;
            }
        }

        ul {
            display: flex;
            flex-direction: row;
            width: fit-content;
            background-color: var(--bg-color-ld-white-200);
            font-size: var(--base-font-size);
            align-items: center;
            height: 100%;
            gap: 0.5rem;

            /* Find for Sign Out button */
            li:has(button) {
                padding: 0;
                background-color: transparent;
                &:hover {
                    background-color: transparent;
                }
            }

            /* Find top level menu routes */
            li[data-route-level="1"] {
                border: 1px solid var(--color-ld-accent-600);
            }

            li,
            a {
                min-width: 120px;
                width: fit-content;
                height: 45px;
                border-radius: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-decoration: none;
                letter-spacing: normal;
                z-index: 110;
                text-align: center;
                font-weight: bold;
                transition-property: all;
                transition-duration: var(--transition-duration);
                transition-timing-function: ease-in-out;
            }

            /* Active link style */
            .active {
                background-color: var(--color-ld-accent-600);
                >a {
                    color: var(--color-ld-white-300);
                }
            }

            /* Reset subroutes positioning and display logic */
            li:has(.sub-routes) {
                position: relative;
               
                .sub-routes-container {
                    left: 0rem;
                    top: 2.8rem;
                    display: none;
                    position: absolute;
                    min-width: max-content;
                    width: 100%;
                    height: max-content;
                    .sub-routes {
                        gap: 0;
                        display: none;
                        flex-direction: column;
                        min-width: max-content;
                        height: 100%;
                        width: 100%;
                       
                    }
                }
            }

            /* Hover through routes tree */
            li:hover {
                background-color: var(--color-ld-accent-600);
                >a {
                    color: var(--color-ld-white-300);
                }
                transition-property: all;
                transition-duration: var(--transition-duration);
                transition-timing-function: ease-in-out;

                /* Show first route container */
                > .sub-routes-container {
                    display: flex;
                    flex: 1;
                    text-align: center;
                    width: fit-content;

                    /* Show first ul with li routes*/
                    > .sub-routes {
                        margin-left: 0.25rem;
                        margin-top: 0.5rem;
                        display: flex;
                        justify-content: left;
                        align-items: flex-start;
                        flex: 1;
                        width: 100%;
                        min-width: max-content;
                        border-radius: 30px;
                        li {
                            border: 1px solid var(--color-ld-accent-600);
                            margin-bottom: 0.25rem;
                            padding-inline: 0.5rem;
                           
                        }
                        li:hover{
                            >a{
                                color:var(--color-ld-white-300);
                            }
                        }
                    }
                }

                /* Level 2+ route containers: position to the right and set margin-top 0 for the ul */
                .sub-routes-container:not(.sub-routes-container-1) {
                    left: 100%;
                    margin-top: 0rem;
                    top: 0;
                    > .sub-routes {
                        margin-top: 0;
                    }
                }
                /* Level 1 route container: remove margin of left of the ul */
                .sub-routes-container-1 {
                    > .sub-routes {
                        margin-left: 0;
                    }
                }
            }
        }
        .auth-links,
        .logo-wrapper {
            min-width: 100px;
            max-width: fit-content;
        }
    }
</style>
