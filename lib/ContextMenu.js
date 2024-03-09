"use strict";
class ContextMenu {
    element = (h("div", { class: "custom-menu", style: "display:none;" },
        h("div", { class: "custom-menu-item" },
            h("span", { class: "material-symbols-outlined" },
                h("span", { class: "material-symbols-outlined" }, "shelf_auto_hide")),
            " ",
            "Always Show Shelf"),
        h("div", { class: "custom-menu-item" },
            h("span", { class: "material-symbols-outlined" }, "shelf_position"),
            "Shelf Position"),
        h("div", { class: "extra-menu-wrapper" },
            h("div", { class: "custom-menu extra-menu" },
                h("div", { class: "custom-menu-item" },
                    h("span", { class: "material-symbols-outlined" }, "brush"),
                    " Set Wallpaper and Style"))),
        h("div", { class: "custom-menu-item" },
            h("span", { class: "material-symbols-outlined" }, "brush"),
            " Set Wallpaper and Style")));
    constructor() { }
    show() { }
}
//# sourceMappingURL=ContextMenu.js.map