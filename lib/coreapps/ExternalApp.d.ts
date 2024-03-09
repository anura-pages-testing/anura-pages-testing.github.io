declare class ExternalApp extends App {
    manifest: AppManifest;
    source: string;
    icon: string;
    constructor(manifest: AppManifest, source: string);
    static serializeArgs(args: string[]): string;
    static deserializeArgs(args: string): string[];
    open(args?: string[]): Promise<WMWindow | undefined>;
}
