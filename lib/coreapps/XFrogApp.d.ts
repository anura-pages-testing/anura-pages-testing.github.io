declare class XFrogApp extends App {
    manifest: AppManifest;
    activeWin: WMWindow;
    hidden: boolean;
    xwindows: {
        [wid: string]: WMWindow;
    };
    constructor();
    startup(): Promise<void>;
    proc_xwids(wids: string[]): Promise<void>;
    spawn_xwindow(xwid: string): Promise<void>;
    open(): Promise<void>;
}
