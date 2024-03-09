/// <reference types="dreamland" />
declare const decoder: TextDecoder;
declare const encoder: TextEncoder;
declare const SLICE_SIZE: number;
declare const BUF_SIZE = 256;
declare function InitV86Hdd(): Promise<FakeFile>;
declare class V86Backend {
    #private;
    private sendQueue;
    private nextWrite;
    private openQueue;
    private onDataCallbacks;
    private read_intent_phys_addr;
    private write_intent_phys_addr;
    private new_intent_phys_addr;
    private read_nbytes_phys_addr;
    private write_nbytes_phys_addr;
    private s_rows_phys_addr;
    private s_cols_phys_addr;
    private resize_intent_phys_addr;
    vgacanvas: HTMLCanvasElement;
    screen_container: JSX.Element;
    ready: boolean;
    act: boolean;
    cmd_q: string | null;
    virt_hda: FakeFile;
    barepty: number;
    xpty: number;
    runpty: number;
    emulator: any;
    saveinterval: number;
    constructor(virt_hda: FakeFile);
    netids: string[];
    registered: boolean;
    termready: boolean;
    onboot(): Promise<void>;
    runcmd(cmd: string): void;
    closepty(TTYn: number): void;
    canopenpty: boolean;
    opensafeQueue: any;
    openpty(command: string, cols: number, rows: number, onData: (string: string) => void): Promise<number>;
    resizepty(TTYn: number, cols: number, rows: number): void;
    startMouseDriver(): Promise<void>;
    writepty(TTYn: number, data: string): void;
    _proc_data(data: string): Promise<void>;
    read_uint(addr: number): any;
    write_uint(i: number, addr: number): void;
}
declare function savestate(): Promise<void>;
declare function a(): Promise<void>;
interface FakeFile {
    slice: (start: number, end: number) => Promise<Blob>;
    save: (emulator?: any) => Promise<void>;
    delete: () => Promise<void>;
    resize: (size: number) => Promise<void>;
    size: number;
}
