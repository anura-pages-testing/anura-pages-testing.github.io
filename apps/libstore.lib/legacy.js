// This is a workaround for the fact that JSZip doesn't support ESM
// There exists a fork of JSZip that does, but unfortunately performance is
// significantly worse than the original
import * as _ from "./jszip.js"
let JSZip = window.JSZip;
// Delete the global JSZip object to prevent pollution
delete window.JSZip;

const fs = Filer.fs;
const Buffer = Filer.Buffer;

export class Workstore {
    client;
    cache;
    hooks;
    
    constructor(client, hooks) {
        this.client = client;
        this.cache = {};
        this.hooks = hooks || {
            onError: (appName, error) => {
                console.error(error);
            },
            onDownloadStart: (appName) => {
                console.log("Download started");
            },
            onDepInstallStart: (appName, libName) => {
                console.log("Dependency install started");
            },
            onComplete: (appName) => {
                console.log("Download complete");
            },
        };
    }

    refresh(repos = []) {
        if (repos.length === 0) {
            this.cache = {};
            return
        }
        repos.forEach((repo) => {
            this.cache[repo] = null;
        });
    }

    async getRepo(url, name) {
        if (this.cache[url]) {
            return this.cache[url];
        }

        const repo = new WorkstoreRepo(this.client, this.hooks, url, name);
        await repo.refreshRepoCache();
        this.cache[url] = repo;
        return repo;
    }
}

export class WorkstoreRepo {
    baseUrl;
    name;
    client;
    hooks;
    repoCache;
    thumbCache = { apps: {}, libs: {} };

    constructor(client, hooks, baseUrl, name) {
        this.client = client;
        this.hooks = hooks;
        this.baseUrl = baseUrl;
        this.name = name;
    }
    
    setHook(name, fn) {
        this.hooks[name] = fn;
    }
    
    async refreshRepoCache() {
        this.repoCache = await (
            await this.client.fetch(this.baseUrl + "list.json")
        ).json();
    }

    refreshThumbCache() {
        this.thumbCache = { apps: {}, libs: {} };
    }

    async getAppThumb(appName) {
        if (this.thumbCache.apps[appName]) {
            return this.thumbCache.apps[appName];
        }
        const app = await this.getApp(appName);
        if (!app) {
            throw new Error("App not found");
        }
        let thumb;
        try {
            thumb = URL.createObjectURL(await (await fetch(this.baseUrl + app.icon)).blob())
        } catch (e) {
            // Probably a network error, the sysadmin might have blocked the repo, this isn't the default because its a massive waste of bandwidth
            thumb = URL.createObjectURL(await (await this.client.fetch(this.baseUrl + app.icon)).blob())
        }
        this.thumbCache.apps[appName] = thumb;
        return thumb;
    }

    async getLibThumb(libName) {
        if (this.thumbCache.libs[libName]) {
            return this.thumbCache.libs[libName];
        }
        const lib = await this.getLib(libName);
        if (!lib) {
            throw new Error("Lib not found");
        }
        let thumb;
        try {
            thumb = URL.createObjectURL(await (await fetch(this.baseUrl + lib.icon)).blob())
        } catch (e) {
            // Probably a network error, the sysadmin might have blocked the repo, this isn't the default because its a massive waste of bandwidth
            thumb = URL.createObjectURL(await (await this.client.fetch(this.baseUrl + lib.icon)).blob())
        }
        this.thumbCache.libs[libName] = thumb;
        return thumb;
    }

    async getApps() {
        if (!this.repoCache) {
            await this.refreshRepoCache();
        }
        return this.repoCache.apps || [];
    }

    async getApp(appName) {
        if (!this.repoCache) {
            await this.refreshRepoCache();
        }
        return this.repoCache.apps.find((app) => app.name === appName);
    }

    async getLibs() {
        if (!this.repoCache) {
            await this.refreshRepoCache();
        }
        return this.repoCache.libs || [];
    }

    async getLib(libName) {
        if (!this.repoCache) {
            await this.refreshRepoCache();
        }
        return this.repoCache.libs.find((lib) => lib.name === libName);
    }

    async installApp(appName) {
        const app = await this.getApp(appName);
        if (!app) {
            throw new Error("App not found");
        }
        this.hooks.onDownloadStart(appName);

        if (app.dependencies) {
            for (const lib of app.dependencies) {
                let hasDep =
                    Object.keys(anura.libs).filter(
                        (x) => anura.libs[x].name == lib,
                    ).length > 0;
                if (hasDep) continue;
                this.hooks.onDepInstallStart(appName, lib);
                await this.installLib(lib);
            }
        }

        const zipFile = await (await this.client.fetch(this.baseUrl + app.data)).blob();
        let zip = await JSZip.loadAsync(zipFile);
        console.log(zip);

        const path = `/userApps/${appName}.app`;

        await new Promise((resolve) =>
            new fs.Shell().mkdirp(path, function () {
                resolve();
            }),
        );

        let postInstallScript;

        try {
            for (const [_, zipEntry] of Object.entries(
                zip.files,
            )) {
                if (zipEntry.dir) {
                    fs.mkdir(`${path}/${zipEntry.name}`);
                } else {
                    if (zipEntry.name == "post_install.js") {
                        let script = await zipEntry.async("string");
                        postInstallScript = script;
                        continue;
                    }
                    fs.writeFile(
                        `${path}/${zipEntry.name}`,
                        await Buffer.from(
                            await zipEntry.async("arraybuffer"),
                        ),
                    );
                }
            }
            await anura.registerExternalApp("/fs" + path);
            if (postInstallScript) window.top.eval(postInstallScript);
            this.hooks.onComplete(appName);
        } catch (error) {
            this.hooks.onError(appName, error);
        }
    }

    async installLib(libName) {
        const lib = await this.getLib(libName);
        if (!lib) {
            throw new Error("Lib not found");
        }
        this.hooks.onDownloadStart(libName);
        const zipFile = await (await this.client.fetch(this.baseUrl + lib.data)).blob();
        let zip = await JSZip.loadAsync(zipFile);
        console.log(zip);

        const path = `/userLibs/${libName}.lib`;

        await new Promise((resolve) =>
            new fs.Shell().mkdirp(path, function () {
                resolve();
            }),
        );

        try {
            for (const [_, zipEntry] of Object.entries(
                zip.files,
            )) {
                if (zipEntry.dir) {
                    fs.mkdir(`${path}/${zipEntry.name}`);
                } else {
                    fs.writeFile(
                        `${path}/${zipEntry.name}`,
                        await Buffer.from(
                            await zipEntry.async("arraybuffer"),
                        ),
                    );
                }
            }
            await anura.registerExternalLib("/fs" + path);
            this.hooks.onComplete(libName);
        } catch (error) {
            this.hooks.onError(libName, error);
        }
    }

}

// Re-export JSZip for convenience
export { JSZip };