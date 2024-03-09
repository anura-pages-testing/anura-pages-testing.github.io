"use strict";
class WMAPI {
    windows = [];
    hasFullscreenWindow = false;
    create(ctx, info, onfocus = null, onresize = null, onclose = null, onmaximize = null, onunmaximize = null, onsnap = null) {
        const win = AliceWM.create(info);
        win.focus();
        win.onfocus = () => {
            //@ts-ignore
            document.activeElement?.blur();
            alttab.update();
            taskbar.element.style.zIndex = getHighestZindex() + 3 + "";
            if (onfocus)
                onfocus();
        };
        win.onresize = (width, height) => {
            if (onresize)
                onresize(width, height);
        };
        win.onclose = () => {
            if (onclose)
                onclose();
            this.windows = this.windows.filter((w) => w.deref() !== win);
        };
        win.onmaximize = () => {
            if (onmaximize)
                onmaximize();
            taskbar.maximizedWins.push(win);
            taskbar.updateRadius();
        };
        win.onunmaximize = () => {
            if (onunmaximize)
                onunmaximize();
            taskbar.maximizedWins = taskbar.maximizedWins.filter((w) => w !== win);
            taskbar.updateRadius();
        };
        win.onsnap = (snapDirection) => {
            if (onsnap)
                onsnap(snapDirection);
            console.log(snappedWindows);
            taskbar.updateRadius();
        };
        ctx.windows.push(win);
        this.windows.push(new WeakRef(win));
        taskbar.updateTaskbar();
        alttab.update();
        return win;
    }
    createGeneric(info, onfocus = null, onresize = null, onclose = null, onmaximize = null, onunmaximize = null, onsnap = null) {
        const win = AliceWM.create(info);
        const ctx = anura.apps["anura.generic"];
        win.focus();
        win.onfocus = () => {
            //@ts-ignore
            document.activeElement?.blur();
            alttab.update();
            taskbar.element.style.zIndex = getHighestZindex() + 3 + "";
            if (onfocus)
                onfocus();
        };
        win.onresize = (width, height) => {
            if (onresize)
                onresize(width, height);
        };
        win.onclose = () => {
            if (onclose)
                onclose();
            this.windows = this.windows.filter((w) => w.deref() !== win);
        };
        win.onmaximize = () => {
            if (onmaximize)
                onmaximize();
            taskbar.maximizedWins.push(win);
            taskbar.updateRadius();
        };
        win.onunmaximize = () => {
            if (onunmaximize)
                onunmaximize();
            taskbar.maximizedWins = taskbar.maximizedWins.filter((w) => w !== win);
            taskbar.updateRadius();
        };
        win.onsnap = (snapDirection) => {
            if (onsnap)
                onsnap(snapDirection);
            console.log(snappedWindows);
            taskbar.updateRadius();
        };
        ctx.windows.push(win);
        this.windows.push(new WeakRef(win));
        taskbar.updateTaskbar();
        alttab.update();
        return win;
    }
}
//# sourceMappingURL=WmApi.js.map