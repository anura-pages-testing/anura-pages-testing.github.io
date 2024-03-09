"use strict";
class XAppStub extends App {
    command;
    constructor(name, packageIdent, icon, command) {
        super();
        this.name = name;
        this.package = packageIdent;
        this.icon = icon || "/assets/icons/xfrog.png";
        this.command = command;
    }
    async open() {
        anura.x86?.runcmd(this.command);
        anura.x86?.screen_container.remove();
    }
}
//# sourceMappingURL=XAppStub.js.map