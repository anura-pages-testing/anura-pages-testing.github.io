/**
 * the purpose of the following code is to give a demo of
 * how to realize the floating dialog using javascript.
 *It was written without any consideration of cross-browser compatibility,
 * and it can be run successfully under the firefox 3.5.7.
 *
 * nope nope this code has NOT been stolen rafflesia did NOT make it :thumbsup:
 */
/// <reference types="dreamland" />
type SnappedWindow = {
    window: WMWindow;
    direction: "left" | "right";
};
declare let splitBar: WMSplitBar | null;
declare const minimizedSnappedWindows: SnappedWindow[];
declare const snappedWindows: SnappedWindow[];
/**
 * to show a floating dialog displaying the given dom element
 * @param {Object} title "title of the dialog"
 */
declare const windowInformation: {};
declare const windowID = 0;
declare class WindowInformation {
    title: string;
    width: string;
    minwidth: number;
    height: string;
    minheight: number;
    allowMultipleInstance: boolean;
    resizable: boolean;
}
declare class WMWindow {
    element: HTMLElement;
    content: HTMLElement;
    maximized: boolean;
    oldstyle: string | null;
    dragging: boolean;
    dragForceX: number;
    dragForceY: number;
    originalLeft: number;
    originalTop: number;
    resizable: boolean;
    width: number;
    height: number;
    mouseLeft: number;
    mouseTop: number;
    wininfo: WindowInformation;
    state: {
        title: string;
    };
    onfocus: () => void;
    onresize: (w: number, h: number) => void;
    onclose: () => void;
    onmaximize: () => void;
    onsnap: (snapDirection: "left" | "right" | "top") => void;
    onunmaximize: () => void;
    snapped: boolean;
    clampWindows: boolean;
    justresized: boolean;
    minimizing: boolean;
    mouseover: boolean;
    maximizeImg: HTMLImageElement;
    constructor(wininfo: WindowInformation);
    handleDrag(evt: MouseEvent): void;
    focus(): void;
    close(): void;
    togglemaximize(): void;
    maximize(): void;
    unmaximize(): Promise<void>;
    remaximize(): Promise<void>;
    minimize(): void;
    unminimize(): void;
    snap(snapDirection: "left" | "right" | "top"): void;
    getSnapDirection(forceX: number, forceY: number): "left" | "right" | "top" | null;
    getSnapDirectionFromPosition(left: number, width: number): "left" | "right" | null;
    snapPreview(side: "left" | "right" | "top"): DLElement<any>;
}
declare class WMSplitBar {
    dragging: boolean;
    mouseLeft: number;
    originalLeft: number;
    leftWindow: WMWindow;
    rightWindow: WMWindow;
    element: JSX.Element;
    cleanup(): void;
    constructor(leftWindow: WMWindow, rightWindow: WMWindow);
    handleDrag(evt: MouseEvent): void;
    splitWindowsAround(x: number): void;
    fadeIn(): void;
    fadeOut(): void;
    remove(): void;
    instantRemove(): void;
}
declare const AliceWM: {
    create: (givenWinInfo: string | WindowInformation) => WMWindow;
};
declare function deactivateFrames(): void;
declare function reactivateFrames(): void;
declare function getHighestZindex(): number;
declare function normalizeZindex(): Promise<void>;
/**
 * place the given dom element in the center of the browser window
 * @param {Object} element
 */
declare function center(element: HTMLElement): void;
/**
 * callback function for the dialog closed event
 * @param {Object} container
 */
