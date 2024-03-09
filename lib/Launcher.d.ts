/// <reference types="dreamland" />
declare class Launcher {
    private search;
    css: string;
    clickoffCheckerCss: string;
    element: JSX.Element;
    clickoffChecker: JSX.Element;
    constructor();
    handleSearch(event: Event): void;
    toggleVisible(): void;
    hide(): void;
    clearSearch(): void;
    addShortcut(app: App): void;
}
declare const LauncherShortcut: Component<{
    app: App;
    onclick: () => void;
}, Record<string, never>>;
