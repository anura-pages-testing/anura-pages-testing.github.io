/// <reference types="dreamland" />
declare const settingsCSS: string;
declare class SettingsApp extends App {
    name: string;
    package: string;
    icon: string;
    state: Stateful<{
        show_x86_install: any;
        x86_installing: boolean;
        resizing: boolean;
    }>;
    page: () => Promise<JSX.Element>;
    constructor();
    open(): Promise<WMWindow | undefined>;
}
