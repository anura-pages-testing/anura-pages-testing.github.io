/// <reference types="dreamland" />
declare class RecoveryApp extends App {
    name: string;
    package: string;
    icon: string;
    css: string;
    page: () => Promise<JSX.Element>;
    constructor();
    open(args?: string[]): Promise<WMWindow | undefined>;
}
