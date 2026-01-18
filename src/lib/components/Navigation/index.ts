import { page } from "$app/state";
import type { Route } from "$lib/components/Navigation/routes";
import type { User } from "../../../app";

// helper function to get the value of type T on basis of the key from type T
type ValueOf<T> = T[keyof T];

export const NavType = {
    normal: "normal",
    aside: "aside",
} as const satisfies Record<string, string>;
export type NavType = ValueOf<typeof NavType>;

export const LinkPosition = {
    left: "left",
    center: "center",
    right: "right",
} as const satisfies Record<string, string>;

export type LinkPosition = keyof (typeof LinkPosition);

export const NavPosition = {
    top: "top",
    bottom: "bottom",
} as const satisfies Record<string, string>;
export type NavPosition = ValueOf<typeof NavPosition>;


export interface NavProps {
    navPosition: NavPosition;
    linkPosition: LinkPosition;
    navHeight: number;
}

export const showRoute = (user: User | undefined, route: Route): boolean => {
    if (!route.public) {
        return user?.role === route.role && user?.id !== undefined ? true : false;
    } else {
        return true;
    }
};

export const isRouteActive = (routePath: string) => {
    if (
        page.url.pathname == routePath ||
        (page.url.pathname.includes(routePath.toLowerCase()) &&
            routePath.toLowerCase() != "/")
    ) {
        return true;
    }
};

export const checkSubRoutes = (
    routes: Route[],
    iteration = 0,
    count = 0,
): number => {
    let _i = 0;
    routes.forEach((route: Route, index: number) => {
        _i = route.subRoutes ? index : _i;
    });

    if (_i === 0) return count;

    if (_i > 0 && routes[_i].subRoutes) {
        let _c = routes[_i].subRoutes?.length ?? 0;

        if (iteration > 0) _c = _c - 1;

        count += _c;
        iteration++;
        return checkSubRoutes(routes[_i].subRoutes!, iteration, count);
    }
    return count;
};

export const getRouteLevel = (v: string) => v.split("/").length - 1;