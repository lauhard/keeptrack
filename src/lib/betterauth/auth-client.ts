import { goto, invalidateAll } from "$app/navigation";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    plugins: [
        adminClient()
    ]
});

export const signout = async () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: async () => {
                    await invalidateAll();
                    goto("/");
                },
            },
        });
    };