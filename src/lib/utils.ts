import type { User } from "../app";

export const UserRole = {
    user: "user",
    admin: "admin",
} as const satisfies Record<string, string>;

export type UserRole = keyof (typeof UserRole);

export const getUserRole = (user: User) => {
    return (
        (user === null || user === undefined ? "user" : user.role)
        === UserRole.admin ? UserRole.admin : UserRole.user
    );
}