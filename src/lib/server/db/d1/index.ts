import { drizzle } from "drizzle-orm/d1";
import type { Platform } from "../../../../app";
import * as schema from './schema/index';


export const getD1DatabaseName = (): string => {
    const d1_name = import.meta.env.VITE_DATABASE_NAME;
    if (!d1_name) {
        throw new Error('VITE_DATABASE_NAME is not set');
    }
    return d1_name;
}

export const setD1Binding = (platform: Platform) => {
    const d1_name = getD1DatabaseName();
    if(!platform) {
        throw new Error('Platform is not provided. Adapter cloudflare is required.');
    }
    if (!platform.env[d1_name]) {
        throw new Error(`D1 database binding "${d1_name}" is not found`); 
    } 
    else {
        return platform.env[d1_name];
    }
}

export const d1 = ({ platform }:{ platform: Platform }):ReturnType<typeof drizzle<typeof schema>> => {
    return drizzle(setD1Binding(platform), { schema });
}