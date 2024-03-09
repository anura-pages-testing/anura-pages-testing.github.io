declare class x86MgrApp extends App {
    name: string;
    package: string;
    icon: string;
    source: string;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
