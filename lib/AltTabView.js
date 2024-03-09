"use strict";
class AltTabView {
    element;
    state;
    viewWindow([app, win, index]) {
        return (h("div", null,
            h("div", { class: use(this.state.index, (stateIndex) => "alttab-window " +
                    (index == stateIndex
                        ? "alttab-window-selected"
                        : "")) },
                h("div", { class: "alttab-window-icon-container" },
                    h("img", { class: "alttab-icon-large", src: app?.icon, alt: "App Icon" }))),
            h("div", { class: "alttab-titlebar" },
                h("img", { class: "alttab-icon-inline", src: app?.icon, alt: "App Icon" }),
                h("span", { class: "alttab-window-title-text" }, win.state.title || app.name))));
    }
    view() {
        return (h("div", { class: use(this.state.active, (active) => "alttab-container " + (active ? "" : "alttab-hidden")) }, $if(use(this.state.windows.length, Boolean), h("div", { class: "alttab-window-list" }, use(this.state.windows, (windows) => windows
            .map(([a, w], i) => [a, w, i])
            .map(this.viewWindow.bind(this)))), h("div", { class: "alttab-nowindows" },
            h("span", null, "No windows")))));
    }
    constructor() {
        this.state = stateful({
            windows: [],
            index: 0,
            active: false,
        });
        this.element = this.view();
    }
    update() {
        const windows = Object.values(anura.apps).flatMap((a) => a.windows.map((w) => [a, w]));
        windows.sort(([_appA, winA], [_appB, winB]) => Number(winB.element.style.zIndex) -
            Number(winA.element.style.zIndex));
        this.state.windows = windows;
        // ensure index doesn't underflow or overflow
        this.state.index = Math.max(0, Math.min(this.state.index, this.state.windows.length - 1));
        this.element.style.setProperty("z-index", (getHighestZindex() + 1).toString());
        normalizeZindex();
    }
    onComboPress() {
        console.log("comboPress");
        console.log("index", this.state.index, "windows", {
            windows: this.state.windows,
        });
        if (!this.state.active) {
            this.state.index = 1 % this.state.windows.length;
            this.state.active = true;
            return;
        }
        this.state.index = (this.state.index + 1) % this.state.windows.length;
    }
    onModRelease() {
        console.log("modRelease");
        if (this.state.active) {
            this.state.active = false;
            const appWin = this.state.windows[this.state.index];
            if (!appWin)
                return;
            const [_app, win] = appWin;
            win.unminimize();
            win.focus();
        }
    }
}
//# sourceMappingURL=AltTabView.js.map