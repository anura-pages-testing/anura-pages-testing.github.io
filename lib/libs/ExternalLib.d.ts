interface LibManifest {
    name: string;
    icon: string;
    package: string;
    versions: {
        [key: string]: string;
    };
    installHook?: string;
    cache?: boolean;
    currentVersion: string;
}
declare class ExternalLib extends Lib {
    source: string;
    manifest: LibManifest;
    cache: {
        [key: string]: any;
    };
    installedLibs: string[];
    constructor(manifest: LibManifest, source: string);
    getImport(version?: string): Promise<any>;
}
