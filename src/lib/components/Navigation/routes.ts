import { goto, invalidateAll } from '$app/navigation';
import { authClient } from '$lib/betterauth/auth-client';
import { House, ShieldUser, User, UserCog, UserRoundPlus, Settings2, CakeSlice, type Icon as IconType } from '@lucide/svelte';
export interface Route {
    path?: string;
    fn?: (callback?: () => void) => void | Promise<void>;
    style?: string;
    name: string;
    icon?: typeof IconType | undefined;
    public?: boolean;
    role?: string;
    subRoutes?: Route[];
}

export const routes = [
    {
        path: '/',
        name: 'Home',
        icon: House,
        public: true,
    }
] as Route[];

export const accountRoutes = [
    {
        path: '/account',
        name: 'Account',
        icon: User,
        public: false,
        role: 'user',
    },
    {
        path: '/account/profile',
        name: 'Profile',
        icon: UserCog,
        public: false,
        role: 'user',
    },
    {
        path: '/account/settings',
        name: 'Settings',
        icon: Settings2,
        public: false,
        role: 'user',
    }
] as Route[];