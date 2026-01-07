<script lang="ts">
    import { LucideInfo, LucideX } from "@lucide/svelte";

    let customDataCol = $state("var(--color-ld-accent-500)");
    let customDataLen = $state("");

    const showBox = () => {
        customDataCol = "var(--color-ld-accent-700)";
        customDataLen = "500";
        //console.log("mouse enter " + customDataCol + " " + customDataLen);
    };
    const hideBox = () => {
        customDataCol = "var(--color-ld-accent-500)";
        customDataLen = "";
       // console.log("mouse leave " + customDataCol + " " + customDataLen);
    };
</script>

<article>
    <h1>Hello</h1>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="little-circle"
        data-custom={customDataCol}
        data-len={customDataLen}
    >
        <div class="content" class:showContent={customDataLen != ""}>
            <h2>Some basic information</h2>
            <p>bla</p>
        </div>
    </div>
    {#if customDataLen == ""}
        <button class="showButton" onclick={showBox}>
            <LucideInfo />
        </button>
    {/if}
    {#if customDataLen != ""}
        <button class="closeButton" onclick={hideBox}>
            <LucideX />
        </button>
    {/if}
</article>

<style>
    article {
        height: calc(100vh - (var(--header-height) + 110px));
        width: 100%;
        overflow: hidden;
        position: relative;
        h1 {
            text-align: center;
        }
    }
    .showButton, .closeButton {
        position: fixed;
        top: .5rem;
        left: 0rem;
        border: none;
        color:var(--color-ld-white-500);
        z-index: 2100;
    }
    .closeButton {
        left:unset;
        right: 0rem;
       
    }
    .little-circle {
        --width: attr(data-len svh, 10rem);
        --height: attr(data-len svh, 10rem);
        display: grid;
        place-items: center center;
        place-content: center center;

        width: var(--width);
        height: var(--height);

        border-radius: 50%;
        position: fixed;
        z-index: 2000;
        top: calc(var(--width) / -2);
        left: calc(var(--width) / -2);
        transition: all ease-in-out 600ms;
        overflow: visible;

        background-color: attr(
            data-custom type(<color>),
            var(--color-ld-accent-500)
        );
        .content {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            text-align: center;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: auto;
            display: none;
            opacity: 0;
            overflow: hidden;
            color:var(--color-ld-white-500);
            transition:
                opacity 200ms ease-in-out,
                display 200ms ease-in-out allow-discrete;
            transition-delay: 100ms;
        }
        .showContent {
            opacity: 1;
            display: flex;
            transition:
                opacity 200ms ease-in-out,
                display 200ms ease-in-out allow-discrete;
            transition-delay: 300ms;
            @starting-style {
                opacity: 0;
            }
        }
    }
</style>
