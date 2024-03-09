"use strict";
class URIHandlerAPI {
    // Handles a URI like "protocol:something/etc" by opening the appropriate app or library.
    async handle(uri) {
        // const url = new URL(uri);
        // const protocol = url.protocol.slice(0, -1);
        const [protocol, ...path] = uri.split(":");
        const pathname = path.join(":");
        const handlers = anura.settings.get("URIHandlers") || {};
        const handler = handlers[protocol];
        if (!handler) {
            throw new Error(`No handler for URI protocol ${protocol}`);
        }
        if (handler.handler.tag === "lib") {
            let lib;
            if (handler.handler.version) {
                lib = await anura.import(handler.handler.pkg + "@" + handler.handler.version);
            }
            else {
                lib = await anura.import(handler.handler.pkg);
            }
            await lib[handler.handler.import]((handler.prefix || "") + pathname);
        }
        else if (handler.handler.tag === "app") {
            const app = handler.handler;
            if (app.method.tag === "split") {
                const args = pathname.split(app.method.separator);
                await anura.apps[app.pkg].open(handler.prefix ? [handler.prefix, ...args] : args);
            }
            else {
                await anura.apps[app.pkg].open((handler.prefix || "") + pathname);
            }
        }
    }
    // Sets a handler for a URI protocol.
    set(protocol, options) {
        const handlers = anura.settings.get("URIHandlers") || {};
        handlers[protocol] = options;
        anura.settings.set("URIHandlers", handlers);
    }
    // Removes a handler for a URI protocol.
    remove(protocol) {
        const handlers = anura.settings.get("URIHandlers") || {};
        delete handlers[protocol];
        anura.settings.set("URIHandlers", handlers);
    }
    // Determines if a handler is set for a URI protocol.
    has(protocol) {
        const handlers = anura.settings.get("URIHandlers") || {};
        return !!handlers[protocol];
    }
}
//# sourceMappingURL=URIHandler.js.map