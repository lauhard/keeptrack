<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import { type ActionResult, type SubmitFunction } from "@sveltejs/kit";
    import { authClient } from "$lib/betterauth/auth-client";
    import { goto, invalidateAll } from "$app/navigation";
    import type { ActionData } from "./$types";
    import { resolve } from "$app/paths";

    let { form }: { form: ActionData } = $props();
    let name = $state<string>("");
    let email = $state<string>("");
    let password = $state<string>("");
    let betterAuthError = $state<string | null>(null);

    const submitFunction: SubmitFunction = (event) => {
        betterAuthError = null;
        return async ({ result }: { result: ActionResult }) => {
            await applyAction(result);
            if (result.type === "success" && result.data?.success === true) {
                // handle successful signup, e.g., redirect or show a message
                await authClient.signUp.email(
                    {
                        name,
                        password,
                        email,
                    },
                    {
                        onSuccess: async (data) => {
                            await invalidateAll();
                            goto("/auth/login");
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

<article class="signup">
    <!-- {#if form?.errors} -->
    <!-- {@render error(form?.message)} -->
    <!-- {/if} -->

    <form action="?/signup" use:enhance={submitFunction} method="POST">
        <fieldset>
            <h2>KeepTrack</h2>
            <label for="signup_name"
                >Name
                <input
                    type="text"
                    bind:value={name}
                    name="name"
                    id="signup_name"
                    required
                />
                {@render fromError(form?.errors, "name")}
            </label>
            <label for="signup_email"
                >Email
                <input
                    type="email"
                    bind:value={email}
                    name="email"
                    id="signup_email"
                    required
                />
                {@render fromError(form?.errors, "email")}
            </label>
            <label for="signup_password"
                >Password
                <input
                    type="password"
                    bind:value={password}
                    name="password"
                    id="signup_password"
                    autocomplete="new-password"
                    required
                />
                {@render fromError(form?.errors, "password")}
            </label>
            {#if betterAuthError}
                {@render error(betterAuthError)}
            {/if}
            <div class="action-wrapper">
                <button class="btn-signup" type="submit">Signup</button>
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

    .signup {
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
                    button {
                        border-radius: 30px;
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
