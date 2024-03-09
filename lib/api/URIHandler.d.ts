interface LibURIHandler {
    tag: "lib";
    pkg: string;
    version?: string;
    import: string;
}
type SplitArgMethod = {
    tag: "split";
    separator: RegExp | string;
};
type SingleArgMethod = {
    tag: "single";
};
interface AppURIHandler {
    tag: "app";
    pkg: string;
    method: SplitArgMethod | SingleArgMethod;
}
interface URIHandlerOptions {
    handler: LibURIHandler | AppURIHandler;
    prefix?: string;
}
declare class URIHandlerAPI {
    handle(uri: string): Promise<void>;
    set(protocol: string, options: URIHandlerOptions): void;
    remove(protocol: string): void;
    has(protocol: string): boolean;
}
