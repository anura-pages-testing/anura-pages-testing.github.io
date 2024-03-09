declare class BrowserApp extends App {
    name: string;
    package: string;
    icon: string;
    source: string;
    lib: BrowserLib;
    lastWindow: WMWindow | undefined;
    constructor();
    open(args?: string[]): Promise<WMWindow | undefined>;
}
