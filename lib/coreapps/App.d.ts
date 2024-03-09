declare class App {
    icon: string;
    package: string;
    name: string;
    /**
     * This should be set to false by default because apps should
     * only be hidden if there is an explicit reason to do so
     */
    hidden: boolean;
    windows: WMWindow[];
    open(args?: string[]): void;
}
