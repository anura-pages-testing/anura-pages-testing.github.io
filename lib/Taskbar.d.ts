/// <reference types="dreamland" />
declare class Taskbar {
    #private;
    state: {
        pinnedApps: App[];
        activeApps: App[];
        showBar: boolean;
        rounded: boolean;
        time: string;
        bat_icon: string;
    };
    rounded: string;
    maximizedWins: WMWindow[];
    dragged: null;
    insidedrag: boolean;
    element: JSX.Element;
    shortcut(app: App): JSX.Element | undefined;
    showcontext(app: App, e: MouseEvent): void;
    constructor();
    addShortcut(app: App): void;
    killself(): void;
    updateTaskbar(): void;
    updateRadius(): void;
}
