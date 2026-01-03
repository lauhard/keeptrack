// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, User } from '$lib/betterauth/auth';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: Session,
			user: User
		}
        interface Platform {
			env: Env
			cf: CfProperties
			ctx: ExecutionContext
			caches: { default: Cache } & CacheStorage
		}
    }
}

export { Locals, Platform, User } from './app';