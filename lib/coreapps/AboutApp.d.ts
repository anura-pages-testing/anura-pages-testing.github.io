/// <reference types="dreamland" />
declare class AboutApp extends App {
    name: string;
    package: string;
    icon: string;
    page: () => JSX.Element;
    constructor();
    open(args?: string[]): Promise<WMWindow | undefined>;
    getOSBuild(): string;
}
