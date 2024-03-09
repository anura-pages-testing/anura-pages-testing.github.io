declare class SideloadInstaller extends App {
    name: string;
    package: string;
    icon: string;
    page: () => any;
    constructor();
    open(args?: string[]): Promise<WMWindow | undefined>;
    getOSBuild(): string;
}
