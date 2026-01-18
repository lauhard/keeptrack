import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import type { Platform } from "../../app";
import { admin } from "better-auth/plugins/admin";

const auth = (platform?: Platform) => {
  let database = db({ platform });

  let trustedOrigins: Set<string> = new Set();
  let betterAuthOrigin = platform?.env?.BETTER_AUTH_ORIGIN || process.env.BETTER_AUTH_ORIGIN || '';
  trustedOrigins.add('http://localhost:5173'); // SvelteKit default dev origin
  trustedOrigins.add('http://localhost:8787'); // Cloudflare Workers default dev origin

  if (betterAuthOrigin) trustedOrigins.add(betterAuthOrigin);

  return betterAuth({
    database: drizzleAdapter(database, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false
    },
    plugins: [
      admin(),
      sveltekitCookies(getRequestEvent) // make sure that cookies are properly set when calling signIn/signOut
    ],
    trustedOrigins: Array.from(trustedOrigins)
  }
  )
}

// Infer types with plugin fields included
export type Auth = ReturnType<typeof auth>;
export type Session = Auth["$Infer"]["Session"]["session"];
export type User = Auth["$Infer"]["Session"]["user"];
export default auth;