"use strict";
class SideloadInstaller extends App {
    name = "Anura Package Manager";
    package = "anura.installer";
    icon = "/assets/icons/installer.png";
    page = () => h("div", { class: "app-installer" });
    constructor() {
        super();
    }
    async open(args = []) {
        let fullscreenEasterEgg = false;
        if (args.length > 0) {
            if (args.includes("fullscreen-easter-egg")) {
                fullscreenEasterEgg = true;
            }
            if (args.includes("fuller-screen-easter-egg")) {
                // You asked for it
                document.body.style.background =
                    "url(/assets/images/lagtrain.gif) no-repeat center center fixed";
                anura.wm.windows.forEach((win) => {
                    // No animation
                    win.deref().element.style.display = "none";
                    win.deref().close();
                });
                taskbar.element.remove();
                document.title = "Lagtrain";
                const icon = document.querySelector("link[rel~='icon']");
                icon.type = "image/gif";
                icon.href = "/assets/images/lagtrain.gif";
                return;
            }
        }
        const aboutview = anura.wm.create(this, {
            title: "",
            width: "400px",
            height: fullscreenEasterEgg ? "400px" : "450px",
            resizable: false,
        });
        if (fullscreenEasterEgg) {
            aboutview.content.appendChild(h("div", { style: "background: url(/assets/images/lagtrain.gif); width: 100%; height: 100%; background-size: contain; background-repeat: no-repeat;" }));
        }
        else {
            aboutview.content.appendChild(this.page());
        }
        // make borderless
        aboutview.content.style.position = "absolute";
        aboutview.content.style.height = "100%";
        aboutview.content.style.display = "inline-block";
        const container = aboutview.content.parentElement;
        container.querySelector(".title").style["background-color"] =
            "rgba(0, 0, 0, 0)";
        return aboutview;
    }
    getOSBuild() {
        return anura.settings.get("milestone").slice(0, 7);
    }
}
//# sourceMappingURL=SideloadInstaller.js.map