declare class BrowserLib extends Lib {
    name: string;
    package: string;
    icon: string;
    events: {
        openTab?: (path: string, callback?: () => void) => void;
    };
    constructor(app: BrowserApp, openTabEvent: (path: string, callback?: () => void) => void);
    getImport(version?: string): Promise<any>;
}
