"use strict";
const wallpaperCSS = css `
    .self {
        color: white;
    }
    .header {
        margin-left: 20px;
    }
    .current-wallpaper {
        margin-left: 20px;
        display: flex;
        align-items: center;
    }
    .current-wallpaper-image {
        aspect-ratio: 16/9;
        height: 125px;
        border-radius: 10px;
        margin-right: 20px;
    }
    .current-wallpaper-image:hover {
        cursor: pointer;
    }
    .curr-wallpaper-text {
        color: #b9b9b9;
        margin-bottom: 5px;
    }
    .curr-wallpaper-name {
        margin-top: 0px;
    }
    .separator-hr {
        margin: 20px;
        border: 2px solid #4b4b4b;
        border-radius: 10px;
    }
    .wallpaper-list-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
        margin-left: 20px;
        text-align: center;
        overflow-y: scroll;
        height: 455px;
    }
    .wallpaper-list-item {
        cursor: pointer;
    }
    .wallpaper-list-item-image {
        aspect-ratio: 16/9;
        height: 100px;
        border-radius: 10px;
    }
    .wallpaper-list-item-name {
        margin: 10px;
    }

    .custom-wallpaper {
        margin-left: 20px;
        margin-bottom: 20px;
    }
`;
class WallpaperSelector extends App {
    name = "Wallpaper Selector";
    package = "anura.wallpaper";
    icon = "/assets/icons/wallpaper.png";
    libfilepicker;
    wallpaperList = async () => {
        return await this.loadWallpaperManifest();
    };
    state = stateful({
        resizing: false,
    });
    page = async () => (h("div", { style: "height:100%;width:100%;position:absolute", class: `background ${wallpaperCSS} self` },
        h("div", { class: "header" },
            h("h2", { color: "white" }, "Wallpaper Selector")),
        h("div", { class: "current-wallpaper" },
            h("img", { class: "current-wallpaper-image", src: this.getCurrentWallpaper().url }),
            h("div", { className: "current-wallpaper-attributes" },
                h("h5", { class: "curr-wallpaper-text", color: "gray" }, "Current Wallpaper"),
                h("h3", { class: "curr-wallpaper-name", color: "white" }, this.getCurrentWallpaper().name))),
        h("hr", { class: "separator-hr" }),
        h("div", { class: "custom-wallpaper" },
            h("h5", { class: "curr-wallpaper-text", color: "gray" }, "Custom Wallpaper"),
            h("button", { "on:click": () => {
                    this.libfilepicker
                        .selectFile("(png|jpe?g|gif|bmp|webp|tiff|svg|ico)", this)
                        .then((filename) => {
                        if (filename == undefined)
                            return;
                        const wallpaperName = filename.split("/").pop();
                        const wallpaperURL = "/fs" + filename;
                        this.setNewWallpaper({
                            name: wallpaperName,
                            url: wallpaperURL,
                        });
                    });
                }, id: "custom-wallpaper-btn" }, "Upload")),
        h("hr", { class: "separator-hr" }),
        await this.wallpaperList().then((wallpaperJSON) => {
            const wallpaperList = (h("div", { id: "wallpaper-list", class: "wallpaper-list-container" }));
            wallpaperJSON["wallpapers"].forEach((wallpaper) => {
                wallpaperList.appendChild(h("div", { "on:click": () => {
                        this.setNewWallpaper(wallpaper);
                    }, class: "wallpaper-list-item" },
                    h("img", { class: "wallpaper-list-item-image", src: wallpaper.url }),
                    h("h5", { class: "wallpaper-list-item-name", color: "white" }, wallpaper.name)));
            });
            return wallpaperList;
        })));
    setNewWallpaper(wallpaperObj) {
        anura.settings.set("wallpaper", wallpaperObj.url);
        anura.settings.set("wallpaper-name", wallpaperObj.name);
        this.updateCurrentWallpaperElements();
        this.setWallpaper(wallpaperObj.url);
    }
    getCurrentWallpaper() {
        let currWallpaper = anura.settings.get("wallpaper");
        let currWallpaperName = anura.settings.get("wallpaper-name");
        if (currWallpaper == undefined ||
            currWallpaper == null ||
            currWallpaperName == undefined ||
            currWallpaperName == null) {
            currWallpaper = "/assets/wallpaper/bundled_wallpapers/Default.jpg";
            currWallpaperName = "Default";
            anura.settings.set("wallpaper", currWallpaper);
            anura.settings.set("wallpaper-name", currWallpaperName);
        }
        return {
            name: currWallpaperName,
            url: currWallpaper,
        };
    }
    async loadWallpaperManifest() {
        const wallpaperManifest = await fetch("/assets/wallpaper/bundled_wallpapers/manifest.json");
        return JSON.parse(await wallpaperManifest.text());
    }
    updateCurrentWallpaperElements() {
        // Updates the display for the current wallpaper.
        // I'm so sorry for how ugly this function is, this was written in ~30 seconds.
        const currWallpaper = this.getCurrentWallpaper();
        const currWallpaperImage = document.getElementsByClassName("current-wallpaper-image")[0];
        const currWallpaperName = document.getElementsByClassName("curr-wallpaper-name")[0];
        if (currWallpaperImage == undefined || currWallpaperName == undefined)
            return;
        currWallpaperImage.setAttribute("src", currWallpaper.url);
        currWallpaperName.innerText =
            currWallpaper.name;
    }
    setWallpaper(url) {
        window.document.body.style.background = `url("${url}") no-repeat center center fixed`;
    }
    constructor() {
        super();
    }
    async open() {
        const win = anura.wm.create(this, {
            title: "",
            width: "910px",
            height: "720px",
        });
        if (this.libfilepicker == undefined) {
            // Lazy load the filepicker library.
            this.libfilepicker = await anura.import("anura.filepicker");
        }
        win.content.appendChild(await this.page());
        return win;
    }
}
//# sourceMappingURL=WallpaperSelector.js.map