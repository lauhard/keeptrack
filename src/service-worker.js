/* eslint-disable @typescript-eslint/no-unused-vars */

/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

console.log("sw build", build);
console.log("sw files", files);
console.log("sw version", version);

const CACHE = `cache-${version}`;

const ASSETS = [
    ...build,
    ...files
];

//its a proxy
// it can responseWith in the name of anothter server
// creates an response in the name of an server.
// e.g.

//create a new response in the service worker
//sw.addEventListener("fetch", (event) => {
//    console.log("fetch event", event.request.url);
//    event.respondWith(
//        new Response("Hello from the service worker!")
//    );
//});


// the install event is fired when the s
// service worker is installed.
sw.addEventListener("install", (event) => {
    const addFilesToCache = async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

// cache first strategy
// the fetch event is fired when the service worker
sw.addEventListener("fetch", (event) => {
    // ignore post requests
    if (event.request.method !== "GET") {
        return;
    }

    const response = async () => {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);
        //check if the request url is part of the assets
        // `build`/`files` can always be served from the cache

        if (ASSETS.includes(url.pathname)) {
            // look for the request which is the pathname, in the cache and store the response
            const response = await cache.match(url.pathname);
            //only return the response if it is not null
            if (response) {
                return response;
            }

        }
        try {
            const response = await fetch(event.request);

            // if we're offline, fetch can return a value that is not a Response
            // instead of throwing - and we can't pass this non-Response to respondWith
            if (!(response instanceof Response)) {
                throw new Error('invalid response from fetch');
            }

            if (response.status === 200) {
                cache?.put(event.request, response.clone());
            }

            return response;
        } catch (err) {
            const response = await cache.match(event.request);

            if (response) {
                return response;
            }

            // if there's no cache, then just error out
            // as there is nothing we can do to respond to this request
            throw err;
        }
        // go to the network and fetch the request if it is not in the cache
    }
    // respond to the fetch event with respondWith
    // respondWith: a method that allows you to provide a promise for a custom response to the fetch event
    event.respondWith(response());

});