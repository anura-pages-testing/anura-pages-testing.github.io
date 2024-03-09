declare const $: any;
declare const sleep: (milliseconds: number) => Promise<unknown>;
declare const dg: {
    [key: string]: any;
};
declare function catBufs(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer;
declare function dbg(ref: object): void;
