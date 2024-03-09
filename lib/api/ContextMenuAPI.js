"use strict";
class ContextMenuAPI {
    #element = (h("div", { class: "custom-menu", style: "" }));
    item(text, callback) {
        return (h("div", { class: "custom-menu-item", "on:click": callback.bind(this) }, text));
    }
    #isShown = false;
    constructor() {
        setTimeout(() => document.addEventListener("click", (event) => {
            const withinBoundaries = event
                .composedPath()
                .includes(this.#element);
            if (!withinBoundaries) {
                this.#element.remove();
            }
        }), 100);
    }
    removeAllItems() {
        this.#element.innerHTML = "";
    }
    addItem(text, callback) {
        this.#element.appendChild(this.item(text, function () {
            this.hide();
            callback();
        }));
    }
    show(x, y) {
        // Reset out of bound fixes
        this.#element.style.bottom = "";
        this.#element.style.right = "";
        this.#element.style.top = y.toString() + "px";
        this.#element.style.left = x.toString() + "px";
        document.body.appendChild(this.#element);
        this.#isShown = true;
        this.#element.focus();
        // Check for bounding and fix if necessary
        console.log(this.#element.getBoundingClientRect());
        console.log(document.body.getBoundingClientRect());
        if (this.#element.getBoundingClientRect().bottom >=
            document.body.getBoundingClientRect().bottom) {
            this.#element.style.top = "";
            this.#element.style.bottom = "0px";
        }
        if (this.#element.getBoundingClientRect().right >=
            document.body.getBoundingClientRect().right) {
            this.#element.style.left = "";
            this.#element.style.right = "0px";
        }
        return this.#element;
    }
    hide() {
        if (this.#isShown) {
            document.body.removeChild(this.#element);
            this.#isShown = false;
        }
    }
}
//# sourceMappingURL=ContextMenuAPI.js.map