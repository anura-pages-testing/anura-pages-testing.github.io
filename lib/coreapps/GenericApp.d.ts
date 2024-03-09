declare class GenericApp extends App {
    hidden: boolean;
    constructor();
    open(args?: string[]): Promise<WMWindow | undefined>;
}
