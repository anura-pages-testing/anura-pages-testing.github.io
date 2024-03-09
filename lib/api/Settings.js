"use strict";
class Settings {
    cache = {};
    fs;
    constructor(fs, inital) {
        this.fs = fs;
        this.cache = inital;
        navigator.serviceWorker.ready.then((isReady) => {
            isReady.active.postMessage({
                anura_target: "anura.cache",
                value: this.cache["use-sw-cache"],
            });
            isReady.active.postMessage({
                anura_target: "anura.bareurl",
                value: this.cache["bare-url"],
            });
            console.log("ANURA-SW: For this boot, cache will be " +
                (this.cache["use-sw-cache"] ? "enabled" : "disabled"));
        });
    }
    static async new(fs, defaultsettings) {
        const initial = defaultsettings;
        if (!initial["wisp-url"]) {
            let url = "";
            if (location.protocol == "https:") {
                url += "wss://";
            }
            else {
                url += "ws://";
            }
            url += window.location.origin.split("://")[1];
            url += "/";
            initial["wisp-url"] = url;
        }
        if (!initial["bare-url"]) {
            initial["bare-url"] = location.origin + "/bare/";
        }
        if (!initial["relay-url"]) {
            alert("figure this out later");
        }
        try {
            const raw = await fs.promises.readFile("/anura_settings.json");
            // JSON.parse supports Uint8Array, but for some reason typescript doesn't know that???
            Object.assign(initial, JSON.parse(raw));
        }
        catch (e) {
            fs.writeFile("/anura_settings.json", JSON.stringify(initial));
        }
        return new Settings(fs, initial);
    }
    get(prop) {
        return this.cache[prop];
    }
    has(prop) {
        return prop in this.cache;
    }
    async set(prop, val) {
        this.cache[prop] = val;
        await this.fs.promises.writeFile("/anura_settings.json", JSON.stringify(this.cache));
    }
}
//# sourceMappingURL=Settings.js.map