/// <reference types="dreamland" />
declare class ContextMenuAPI {
    #private;
    item(text: string, callback: VoidFunction): JSX.Element;
    constructor();
    removeAllItems(): void;
    addItem(text: string, callback: VoidFunction): void;
    show(x: number, y: number): JSX.Element;
    hide(): void;
}
