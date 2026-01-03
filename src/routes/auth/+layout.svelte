<script lang="ts">
    import type { Snippet } from "svelte";
    let { children }: { children: Snippet } = $props();
</script>

<div class="auth-layout">
    {@render children()}
</div>

<style>
    .auth-layout {
        display: grid;
        place-content: center;
        place-items:center;
        height: 100%;
        width: 100%;
        @media (width > 600px){
            flex: 1;
        }
    }
</style>
