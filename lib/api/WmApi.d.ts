declare class WMAPI {
    windows: WeakRef<WMWindow>[];
    hasFullscreenWindow: boolean;
    create(ctx: App, info: object, onfocus?: (() => void) | null, onresize?: ((w: number, h: number) => void) | null, onclose?: (() => void) | null, onmaximize?: (() => void) | null, onunmaximize?: (() => void) | null, onsnap?: ((snapDirection: "left" | "right" | "top") => void) | null): WMWindow;
    createGeneric(info: object, onfocus?: (() => void) | null, onresize?: ((w: number, h: number) => void) | null, onclose?: (() => void) | null, onmaximize?: (() => void) | null, onunmaximize?: (() => void) | null, onsnap?: ((snapDirection: "left" | "right" | "top") => void) | null): WMWindow;
}
