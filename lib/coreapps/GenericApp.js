"use strict";
class GenericApp extends App {
    hidden = true;
    constructor() {
        super();
        this.name = "Generic App";
        this.icon = "/assets/icons/generic.png";
        this.package = "anura.generic";
    }
    async open(args = []) {
        alert("This app is not supposed to be opened as it is a placeholder for other apps.");
        return;
    }
}
//# sourceMappingURL=GenericApp.js.map