<script lang=ts>
    import { resolve } from "$app/paths";
    import { getUserState } from "$lib/app-state/user.svelte";
    import { LucideCircleUserRound, LucideLogIn } from "@lucide/svelte";
    let userState = $state(getUserState());
     let { showState = $bindable(false) } = $props<{
        showState: boolean;
    }>();
</script>

<ul class="avatar">
    <li>
        {#if userState?.userInfo?.id}
            <button class="btn btn-account" onclick={() => (showState = true)}>
                <LucideCircleUserRound size="3rem" strokeWidth="1px"
                ></LucideCircleUserRound>
            </button>
        {:else}
            <a class="btn btn-login" href={resolve("/auth/login")}>
                <LucideLogIn></LucideLogIn>
            </a>
        {/if}
    </li>
</ul>

<style>
    .avatar {
        position: fixed;
        right: 1rem;
        z-index: 9999;
        .btn-account {
            padding: 0;
            height: 80px;
            width: 80px;
            border: none;
            color: var(--color-white-500);
            &:hover{
                color:var(--color-ld-accent-500);
            }
        }
        .btn-login {
            margin-top: 0.8rem;
        }
    }
</style>
