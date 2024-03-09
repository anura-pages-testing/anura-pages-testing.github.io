/// <reference types="dreamland" />
type AltTabViewState = {
    windows: [App, WMWindow][];
    index: number;
    active: boolean;
};
declare class AltTabView {
    element: HTMLElement;
    state: Stateful<AltTabViewState>;
    viewWindow([app, win, index]: [App, WMWindow, number]): JSX.Element;
    view(): JSX.Element;
    constructor();
    update(): void;
    onComboPress(): void;
    onModRelease(): void;
}
