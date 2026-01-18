import type { User } from '$lib/betterauth/auth';
import { getContext, setContext } from 'svelte';

class UserStore {
    userInfo = $state<User | null>(null);
    
    constructor(user: User | null) {
        this.userInfo = user;
    }
    
    update(user: User | null) {
        this.userInfo = user;
    }
    
    isAuthenticated(): boolean {
        return this.userInfo !== null;
    }
    
    getRole(): string | null {
        return this.userInfo ? this.userInfo.role || null : null;
    }
}

const USER_CTX = Symbol("USER_CTX");

export const setUserState = (user: User | null): UserStore => {
    const userStore = new UserStore(user);
    setContext<UserStore>(USER_CTX, userStore);
    return userStore;
}

export const getUserState = (): UserStore => {
    return getContext<UserStore>(USER_CTX);
}

