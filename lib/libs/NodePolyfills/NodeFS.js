"use strict";
class NodeFS extends Lib {
    icon = "/assets/icons/generic.png";
    package = "node:fs";
    name = "Node Filesystem";
    versions = {
        "1.0.0": anura.fs,
    };
    latestVersion = "1.0.0";
    async getImport(version) {
        return this.versions[version] || this.versions[this.latestVersion];
    }
}
//# sourceMappingURL=NodeFS.js.map