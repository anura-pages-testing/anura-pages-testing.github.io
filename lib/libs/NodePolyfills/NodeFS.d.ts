declare class NodeFS extends Lib {
    icon: string;
    package: string;
    name: string;
    versions: {
        [key: string]: AnuraFilesystem;
    };
    latestVersion: string;
    getImport(version: string): Promise<any>;
}
