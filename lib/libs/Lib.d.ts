declare class Lib {
    icon: string;
    package: string;
    name: string;
    versions: {
        [key: string]: any;
    };
    latestVersion: string;
    getImport(version: string): Promise<any>;
}
