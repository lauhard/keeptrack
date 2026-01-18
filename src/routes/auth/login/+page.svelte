<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import { type ActionResult, type SubmitFunction } from "@sveltejs/kit";
    import { authClient } from "$lib/betterauth/auth-client";
    import { goto, invalidateAll } from "$app/navigation";
    import type { ActionData } from "./$types";
    import { resolve } from "$app/paths";

    let { form }: { form: ActionData } = $props();
    let email = $state<string>("");
    let password = $state<string>("");
    let betterAuthError = $state<string | null>(null);

    const submitFunction: SubmitFunction = (event) => {
        betterAuthError = null;
        return async ({ result }: { result: ActionResult }) => {
            await applyAction(result);
            if (result.type === "success" && result.data?.success === true) {
                // handle successful signup, e.g., redirect or show a message
                await authClient.signIn.email(
                    {
                        password,
                        email,
                    },
                    {
                        onSuccess: async (data) => {
                            await invalidateAll();
                            goto("/");
                        },
                        onError: async (error) => {
                            betterAuthError =
                                error instanceof Error
                                    ? error.error.code
                                    : String(error.error.message);
                        },
                    },
                );
            }
        };
    };
</script>

<article class="login">
    <!-- {#if form?.errors} -->
    <!-- {@render error(form?.message)} -->
    <!-- {/if} -->

    <form action="?/login" use:enhance={submitFunction} method="POST">
        <fieldset>
            <h2>KeepTrack</h2>

            <label for="login_email"
                >Email
                <input
                    type="email"
                    bind:value={email}
                    name="email"
                    id="login_email"
                    autocomplete="email"
                    required
                />
                {@render fromError(form?.errors, "email")}
            </label>
            <label for="login_password"
                >Password
                <input
                    type="password"
                    bind:value={password}
                    name="password"
                    id="login_password"
                    autocomplete="current-password"
                    required
                />
                {@render fromError(form?.errors, "password")}
            </label>
            {#if betterAuthError}
                {@render error(betterAuthError)}
            {/if}
            <a class="forgot-password" href="#">Forgot Password?</a>
            <div class="action-wrapper">
                <button class="btn btn-login" type="submit">Login</button>
                <fieldset class="divider-signup">
                    <legend>OR</legend>
                    <a class="btn signup" href={resolve("/auth/signup")}
                        >Signup</a
                    >
                </fieldset>
            </div>
        </fieldset>
    </form>
</article>
{#snippet error(message: string)}
    <div class="alert alert-danger">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
            ><path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
            /><path d="M12 9v4" /><path d="M12 17h.01" /></svg
        >
        {message}
    </div>
{/snippet}

{#snippet fromError(errors: any, field: string)}
    {#if errors && errors[field]}
        {#each errors[field].errors as message}
            <div class="alert alert-danger">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
                    ><path
                        d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
                    /><path d="M12 9v4" /><path d="M12 17h.01" /></svg
                >
                {message}
            </div>
        {/each}
    {/if}
{/snippet}

<style>
    /* Hide browser extension injected elements */
    :global(.json-formatter-container) {
        display: none !important;
    }

    .login {
        display: grid;
        place-items: center;
        min-width: 300px;
        max-height: max-content;
        max-width: 500px;
        width: 100%;
        height: 100%;
        form {
            width: 100%;
            display: grid;
            place-items: center;
            place-content: center;
            fieldset {
                display: block;
                border: 1px solid var(--color-ld-white-500);
                border-radius: 20px;
                padding: 0 2rem 2rem 2rem;
                width: inherit;
                height: inherit;
                max-height: inherit;
                h2 {
                    font-family: var(--san-serif);
                    text-align: center;
                    color: var(--color-ld-black-700);
                }
                label {
                    line-height: 1.8rem;
                    input {
                        font-weight: normal;
                    }
                }
                label:has(.alert, .alert-danger) {
                    input {
                        border-color: var(--color-alert-danger);
                    }
                }
                .forgot-password {
                    display: block;
                    width: 100%;
                }
                .action-wrapper {
                    display: flex;
                    flex-direction: column;
                    justify-self: center;
                    margin-top: 1.5rem;
                    width: 100%;
                    .btn,
                    button {
                        border-radius: 30px;
                    }
                    .signup {
                        border: 2px solid var(--color-ld-white-700);
                        color: var(--color-ld-black-700);
                        &:hover {
                            border: 2px solid var(--color-ld-accent-600);
                            color: var(--color-ld-accent-600);
                        }
                    }
                    .divider-signup {
                        margin: 0;
                        padding: 0;
                        margin-top: 1.2rem;
                        padding-top: 1.2rem;
                        border: none;
                        border-top: 1px solid var(--color-ld-accent-600);
                        border-radius: 0;
                        justify-self: center;
                        width: 100%;
                        display: block;
                        legend {
                            width: fit-content;
                            padding-inline: 20px;
                            display: flex;
                            justify-self: center;
                            text-align: center;
                            font-weight: bold;
                            color: var(--color-ld-black-700);
                        }
                    }
                }
            }
            fieldset:has(.alert, .alert-danger) {
                .alert,
                .alert-danger {
                    display: flex;
                    margin-top: -0.5rem;
                    margin-bottom: 0.5rem;
                    background-color: wite;
                    color: var(--color-ld-black-500);
                    width: fit-content;
                    padding-right: 0.5rem;
                    padding-block: 0.2rem;
                    border-radius: 10px;
                    border: 1px solid var(--color-alert-danger);
                    line-height: 1rem;
                    font-size: 0.7rem;
                    svg {
                        color: var(--color-alert-danger);
                        margin-inline: 0.5rem;
                    }
                }
            }
        }
    }
</style>
