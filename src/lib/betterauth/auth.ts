import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import type { Platform } from "../../app";
import { admin } from "better-auth/plugins/admin";

const auth = (platform?: Platform) => {
  let database = db({ platform });
  return betterAuth({
      database: drizzleAdapter(database, {
        provider: "sqlite",
      }),
      emailAndPassword: {
        enabled: true,
        autoSignIn: false
      },
      plugins: [
        admin() ,
        sveltekitCookies(getRequestEvent) // make sure that cookies are properly set when calling signIn/signOut
      ],
      trustedOrigins: ['http://localhost:8787', 'https://tc-ponfeld.lauhard.workers.dev']
    }
  )
}

// Infer types with plugin fields included
export type Auth = ReturnType<typeof auth>;
export type Session = Auth["$Infer"]["Session"]["session"];
export type User = Auth["$Infer"]["Session"]["user"];

export default auth;