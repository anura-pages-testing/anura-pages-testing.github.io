/// <reference types="@mercuryworkshop/alicejs" />
declare class SettingsAppOld extends App {
    name: string;
    package: string;
    icon: string;
    css: string;
    state: Stateful<{
        show_x86: boolean;
        x86_installing: boolean;
        resizing: boolean;
    }>;
    page: () => any;
    toggle(name: string, setting: string): HTMLElement;
    row(item: HTMLElement): any;
    textbox(name: string, setting: string, multiline: boolean): any;
    constructor();
    open(): Promise<WMWindow | undefined>;
    wsurl(): string;
}
