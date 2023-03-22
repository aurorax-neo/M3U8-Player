"use strict";
const version = "v20160449",
    __DEVELOPMENT__ = !0,
    __DEBUG__ = !0,
    offlineResources = ["/js/**", "/css/**", "/layui/**"],
    ignoreFetch = [/https?:\/\/g.alicdn.com\//, /https?:\/\/www.google-analytics.com\//, /https?:\/\/ajax.cloudflare.com\//];

function onInstall(e) {
    log("install event in progress."), e.waitUntil(updateStaticCache())
}

function updateStaticCache() {
    return caches.open(cacheKey("offline")).then((e => e.addAll(offlineResources))).then((() => {
        log("installation complete!")
    }))
}

function sendMsg(e, n) {
    clients.matchAll().then((t => {
        t.forEach((t => {
            1 !== new URL(t.url).pathname.indexOf(n) && t.postMessage(e)
        }))
    }))
}

function onFetch(e) {
    const n = e.request;
    e.respondWith(networkOnly(n))
}

function networkOnly(e, n = 0) {
    return fetch(e).then((e => e)).catch((t => {
        if (log("{networkOnly}", t, n), n < 3) {
            log("{networkOnly retry: }", n);
            let t, o = new URL(e.url);
            t = n <= 1 ? {
                type: "sw.killCros",
                hostname: o.hostname
            } : {
                type: "sw.addCros",
                hostname: o.hostname
            }, sendMsg(t, "/index.html"), networkOnly(e, n += 1)
        }
    }))
}

function networkedOrCached(e) {
    return networkedAndCache(e).catch((() => cachedOrOffline(e)))
}

function networkedAndCache(e) {
    return fetch(e).then((n => {
        var t = n.clone();
        return caches.open(cacheKey("resources")).then((n => {
            n.put(e, t)
        })), log("(network: cache write)", e.method, e.url), n
    }))
}

function cachedOrNetworked(e) {
    return caches.match(e).then((n => (log(n ? "(cached)" : "(network: cache miss)", e.method, e.url), n || networkedAndCache(e).catch((() => offlineResponse(e))))))
}

function networkedOrOffline(e) {
    return fetch(e).then((n => (log("(network)", e.method, e.url), n))).catch((n => (log("(network)", n), offlineResponse(e))))
}

function cachedOrOffline(e) {
    return caches.match(e).then((n => n || offlineResponse(e)))
}

function offlineResponse(e) {
    return log("(offline)", e.method, e.url), e.url.match(/\.(jpg|png|gif|svg|jpeg)(\?.*)?$/) ? caches.match("/offline.svg") : caches.match("/offline.html")
}

function onActivate(e) {
    log("activate event in progress."), e.waitUntil(removeOldCache())
}

function removeOldCache() {
    return caches.keys().then((e => Promise.all(e.filter((e => !e.startsWith(version))).map((e => caches.delete(e)))))).then((() => {
        log("removeOldCache completed.")
    }))
}

function cacheKey() {
    return [version, ...arguments].join(":")
}

function log() {
    developmentMode() && console.log("SW:", ...arguments)
}

function shouldAlwaysFetch(e) {
    return true
}

function shouldFetchAndCache(e) {
    return ~e.headers.get("Accept").indexOf("text/html")
}

function developmentMode() {
    return true
}
log("Hello from ServiceWorker land!", version), self.addEventListener("install", onInstall), self.addEventListener("fetch", onFetch), self.addEventListener("activate", onActivate);