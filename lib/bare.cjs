(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('uuid')) :
	typeof define === 'function' && define.amd ? define(['exports', 'uuid'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bare = {}, global.uuid));
})(this, (function (exports, uuid) { 'use strict';

	// The user likely has overwritten all networking functions after importing bare-client
	// It is our responsibility to make sure components of Bare-Client are using native networking functions
	// These exports are provided to plugins by @rollup/plugin-inject
	const WebSocket = globalThis.WebSocket;
	const Request = globalThis.Request;
	const Response = globalThis.Response;
	const WebSocketFields = {
	    prototype: {
	        send: WebSocket.prototype.send,
	    },
	    CLOSED: WebSocket.CLOSED,
	    CLOSING: WebSocket.CLOSING,
	    CONNECTING: WebSocket.CONNECTING,
	    OPEN: WebSocket.OPEN,
	};

	const maxRedirects = 20;

	const statusEmpty = [101, 204, 205, 304];
	const statusRedirect = [301, 302, 303, 307, 308];
	class BareError extends Error {
	    status;
	    body;
	    constructor(status, body) {
	        super(body.message || body.code);
	        this.status = status;
	        this.body = body;
	    }
	}
	class Client {
	}

	/*
	 * WebSocket helpers
	 */
	const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
	function validProtocol(protocol) {
	    for (let i = 0; i < protocol.length; i++) {
	        const char = protocol[i];
	        if (!validChars.includes(char)) {
	            return false;
	        }
	    }
	    return true;
	}

	class RemoteClient extends Client {
	    static singleton;
	    callbacks = {};
	    uid = uuid.v4();
	    constructor() {
	        if (RemoteClient.singleton)
	            return RemoteClient.singleton;
	        super();
	        // this should be fine
	        // if (!("ServiceWorkerGlobalScope" in self)) {
	        //   throw new TypeError("Attempt to construct RemoteClient from outside a service worker")
	        // }
	        addEventListener("message", (event) => {
	            if (event.data.__remote_target === this.uid) {
	                const callback = this.callbacks[event.data.__remote_id];
	                callback(event.data.__remote_value);
	            }
	        });
	        RemoteClient.singleton = this;
	    }
	    async send(message, id) {
	        const clients = await self.clients.matchAll();
	        if (clients.length < 1)
	            throw new Error("no available clients");
	        for (const client of clients) {
	            client.postMessage({
	                __remote_target: this.uid,
	                __remote_id: id,
	                __remote_value: message
	            });
	        }
	    }
	    async sendWithResponse(message) {
	        const id = uuid.v4();
	        return new Promise((resolve) => {
	            this.callbacks[id] = resolve;
	            this.send(message, id);
	        });
	    }
	    connect(remote, protocols, getRequestHeaders, onMeta, onReadyState) {
	        return new WebSocket("");
	    }
	    async request(method, requestHeaders, body, remote, cache, duplex, signal) {
	        const response = await this.sendWithResponse({
	            type: "request",
	            options: {
	                method,
	                requestHeaders,
	                body,
	                remote: remote.toString(),
	            },
	        });
	        // const readResponse = await this.readBareResponse(response);
	        const result = new Response(statusEmpty.includes(response.status) ? undefined : response.body, {
	            status: response.status,
	            statusText: response.statusText ?? undefined,
	            headers: new Headers(response.headers),
	        });
	        result.rawHeaders = response.headers;
	        result.rawResponse = response;
	        return result;
	    }
	}

	// get the unhooked value
	const getRealReadyState = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'readyState').get;
	const wsProtocols = ['ws:', 'wss:'];
	self.BCC_VERSION = "2.0.3";
	console.warn("BCC_VERSION: " + self.BCC_VERSION);
	const bc = new BroadcastChannel("bcc");
	function setBareClientImplementation(implementation) {
	    self.gBareClientImplementation = implementation;
	}
	function setAllBareClientImplementations(name, ctor, force) {
	    log("attempting to set an implementation on remote clients");
	    bc.postMessage({ name, ctor, force });
	}
	function setAllBareClientImplementationsRemote() {
	    bc.postMessage("set-all-remote");
	}
	function log(...data) {
	    if (self.BCC_DEBUG)
	        console.log(...data);
	}
	bc.addEventListener("message", async (event) => {
	    if (event.data === "set-all-remote" && "ServiceWorkerGlobalScope" in self) {
	        log("Was told to become a remote listener.");
	        setBareClientImplementation(new RemoteClient());
	        return;
	    }
	    const { force, name, ctor } = event.data;
	    log(`Was told (force:${force}) to construct Client '${name}' with props ${ctor}.`);
	    // if we already have a working bare, don't try and make a new one
	    if (!force && !(self.gBareClientImplementation instanceof RemoteClient))
	        return;
	    // this is bad! i don't care
	    const obj = new Function(`return ${name}`)();
	    if (!obj)
	        throw new Error("Invalid set-impl broadcasted");
	    if (obj instanceof Client)
	        setBareClientImplementation(obj);
	    else if (typeof obj.constructor === "function") {
	        const instance = new obj(...ctor);
	        if (typeof instance.demand === "function") {
	            const demand = await instance.demand();
	            setBareClientImplementation(demand || instance.client);
	        }
	        else
	            setBareClientImplementation(instance);
	    }
	    else {
	        throw new Error("Invalid set-impl broadcasted");
	    }
	});
	if ("ServiceWorkerGlobalScope" in self) {
	    if (!self.gBareClientImplementation)
	        setBareClientImplementation(new RemoteClient());
	}
	else {
	    let parent = self;
	    console.log("attempting to find an implementation");
	    for (let i = 0; i < 20; i++) {
	        try {
	            parent = parent.parent;
	            if (parent && parent["gBareClientImplementation"]) {
	                console.warn("found implementation on parent");
	                setBareClientImplementation(parent["gBareClientImplementation"]);
	                break;
	            }
	        }
	        catch (e) {
	            console.log("could not find implementation. using remote [MAY BE SLOW]");
	            // if there's no implementation, resort to remote. this degrades performance, but it really doesn't matter
	            //
	            break;
	        }
	    }
	}
	function registerRemoteListener() {
	    navigator.serviceWorker.addEventListener("message", async (event) => {
	        const uid = event.data.__remote_target;
	        if (uid) {
	            const rid = event.data.__remote_id;
	            switch (event.data.__remote_value.type) {
	                case "request": {
	                    const data = event.data.__remote_value.options;
	                    log(data);
	                    const rawResponse = await self.gBareClientImplementation.request(data.method, data.requestHeaders, data.body, new URL(data.remote), undefined, undefined, undefined, ArrayBuffer);
	                    log(rawResponse);
	                    const body = await rawResponse.blob();
	                    navigator.serviceWorker.controller?.postMessage({
	                        __remote_target: uid,
	                        __remote_id: rid,
	                        __remote_value: {
	                            status: rawResponse.status,
	                            statusText: rawResponse.statusText,
	                            headers: Object.fromEntries(rawResponse.headers.entries()),
	                            redirected: rawResponse.redirected,
	                            body
	                        }
	                    });
	                    break;
	                }
	            }
	        }
	    });
	}
	class BareClient {
	    constructor(...unused) {
	        if (typeof self.gBareClientImplementation !== "object")
	            return;
	        // resolve a demand promise
	        if ("then" in self.gBareClientImplementation)
	            self.gBareClientImplementation.then((d) => self.gBareClientImplementation = d);
	    }
	    createWebSocket(remote, protocols = [], options) {
	        if (!self.gBareClientImplementation)
	            throw new TypeError("A request was made before the client was ready!! This is a problem on the end of whoever set the bare client implementation");
	        try {
	            remote = new URL(remote);
	        }
	        catch (err) {
	            throw new DOMException(`Faiiled to construct 'WebSocket': The URL '${remote}' is invalid.`);
	        }
	        if (!wsProtocols.includes(remote.protocol))
	            throw new DOMException(`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${remote.protocol}' is not allowed.`);
	        if (!Array.isArray(protocols))
	            protocols = [protocols];
	        protocols = protocols.map(String);
	        for (const proto of protocols)
	            if (!validProtocol(proto))
	                throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`);
	        const socket = self.gBareClientImplementation.connect(remote, protocols, async () => {
	            const resolvedHeaders = typeof options.headers === 'function'
	                ? await options.headers()
	                : options.headers || {};
	            const requestHeaders = resolvedHeaders instanceof Headers
	                ? Object.fromEntries(resolvedHeaders)
	                : resolvedHeaders;
	            // user is expected to specify user-agent and origin
	            // both are in spec
	            requestHeaders['Host'] = remote.host;
	            // requestHeaders['Origin'] = origin;
	            requestHeaders['Pragma'] = 'no-cache';
	            requestHeaders['Cache-Control'] = 'no-cache';
	            requestHeaders['Upgrade'] = 'websocket';
	            // requestHeaders['User-Agent'] = navigator.userAgent;
	            requestHeaders['Connection'] = 'Upgrade';
	            return requestHeaders;
	        }, (meta) => {
	            fakeProtocol = meta.protocol;
	            if (options.setCookiesCallback)
	                options.setCookiesCallback(meta.setCookies);
	        }, (readyState) => {
	            fakeReadyState = readyState;
	        }, options.webSocketImpl || WebSocket, ArrayBuffer);
	        // protocol is always an empty before connecting
	        // updated when we receive the metadata
	        // this value doesn't change when it's CLOSING or CLOSED etc
	        let fakeProtocol = '';
	        let fakeReadyState = WebSocketFields.CONNECTING;
	        const getReadyState = () => {
	            const realReadyState = getRealReadyState.call(socket);
	            // readyState should only be faked when the real readyState is OPEN
	            return realReadyState === WebSocketFields.OPEN
	                ? fakeReadyState
	                : realReadyState;
	        };
	        if (options.readyStateHook)
	            options.readyStateHook(socket, getReadyState);
	        else {
	            // we have to hook .readyState ourselves
	            Object.defineProperty(socket, 'readyState', {
	                get: getReadyState,
	                configurable: true,
	                enumerable: true,
	            });
	        }
	        if (options.urlHook)
	            options.urlHook(socket, remote);
	        else
	            Object.defineProperty(socket, 'url', {
	                get: () => remote.toString(),
	                configurable: true,
	                enumerable: true,
	            });
	        const getProtocol = () => fakeProtocol;
	        if (options.protocolHook)
	            options.protocolHook(socket, getProtocol);
	        else
	            Object.defineProperty(socket, 'protocol', {
	                get: getProtocol,
	                configurable: true,
	                enumerable: true,
	            });
	        return socket;
	    }
	    async fetch(url, init) {
	        if (typeof self.gBareClientImplementation !== "object")
	            throw new Error("bad gBareClientImplementation");
	        // resolve a demand promise
	        if ("then" in self.gBareClientImplementation)
	            self.gBareClientImplementation = await self.gBareClientImplementation;
	        // Only create an instance of Request to parse certain parameters of init such as method, headers, redirect
	        // But use init values whenever possible
	        const req = new Request(url, init);
	        // try to use init.headers because it may contain capitalized headers
	        // furthermore, important headers on the Request class are blocked...
	        // we should try to preserve the capitalization due to quirks with earlier servers
	        const inputHeaders = init?.headers || req.headers;
	        const headers = inputHeaders instanceof Headers
	            ? Object.fromEntries(inputHeaders)
	            : inputHeaders;
	        // @ts-ignore
	        const duplex = init?.duplex;
	        const body = init?.body || req.body;
	        let urlO = new URL(req.url);
	        if (!self.gBareClientImplementation)
	            throw new TypeError("A request was made before the client was ready!! This is a problem on the end of whoever set the bare client implementation");
	        for (let i = 0;; i++) {
	            if ('host' in headers)
	                headers.host = urlO.host;
	            else
	                headers.Host = urlO.host;
	            const response = await self.gBareClientImplementation.request(req.method, headers, body, urlO, req.cache, duplex, req.signal, ArrayBuffer);
	            response.finalURL = urlO.toString();
	            const redirect = init?.redirect || req.redirect;
	            if (statusRedirect.includes(response.status)) {
	                switch (redirect) {
	                    case 'follow': {
	                        const location = response.headers.get('location');
	                        if (maxRedirects > i && location !== null) {
	                            urlO = new URL(location, urlO);
	                            continue;
	                        }
	                        else
	                            throw new TypeError('Failed to fetch');
	                    }
	                    case 'error':
	                        throw new TypeError('Failed to fetch');
	                    case 'manual':
	                        return response;
	                }
	            }
	            else {
	                return response;
	            }
	        }
	    }
	}

	/**
	 *
	 * Facilitates fetching the Bare server and constructing a BareClient.
	 * @param server Bare server
	 * @param signal Abort signal when fetching the manifest
	 */
	async function createBareClient(...args) {
	    return new BareClient();
	}

	exports.BareClient = BareClient;
	exports.BareError = BareError;
	exports.Client = Client;
	exports.WebSocketFields = WebSocketFields;
	exports.createBareClient = createBareClient;
	exports.maxRedirects = maxRedirects;
	exports.registerRemoteListener = registerRemoteListener;
	exports.setAllBareClientImplementations = setAllBareClientImplementations;
	exports.setAllBareClientImplementationsRemote = setAllBareClientImplementationsRemote;
	exports.setBareClientImplementation = setBareClientImplementation;
	exports.statusEmpty = statusEmpty;
	exports.statusRedirect = statusRedirect;

}));
//# sourceMappingURL=bare.cjs.map
