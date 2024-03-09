"use strict";
const $ = document.querySelector.bind(document);
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const dg = {};
function catBufs(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}
function dbg(ref) {
    const name = Object.keys(ref)[0];
    dg[name] = name;
}
//# sourceMappingURL=Utils.js.map