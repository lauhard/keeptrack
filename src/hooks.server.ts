import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import auth from "$lib/betterauth/auth";
export const handle = async ({ event, resolve }) => {
    const session = await auth({platform: event.platform}).api.getSession({
        headers: event.request.headers
    });

    if(session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    }
    console.log('Locals in handle hook:', event.locals.user);
    return svelteKitHandler({ event, resolve, auth: auth(event.platform), building });
}