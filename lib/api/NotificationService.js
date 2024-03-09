"use strict";
class NotificationService {
    element = (h("div", { class: "notif-container" }));
    notifications = [];
    constructor() { }
    add(params) {
        const notif = new AnuraNotification(params, () => {
            this.remove(notif);
        });
        this.element.appendChild(notif.element);
        this.notifications.push(notif);
    }
    remove(notification) {
        this.notifications = this.notifications.filter((n) => n != notification);
        notification.element.style.opacity = "0";
        setTimeout(() => {
            notification.element.remove();
        }, 360);
    }
}
class AnuraNotification {
    title = "Anura Notification";
    description = "Anura Description";
    timeout = 2000;
    closeIndicator = false;
    callback = (_notif) => null;
    buttons = [];
    close;
    element;
    constructor(params, close) {
        Object.assign(this, params);
        this.close = close;
        this.buttons = params.buttons || [];
        this.element = (h("div", { class: "notif" },
            h("div", { class: "notif-close-indicator", "on:click": () => {
                    this.close();
                } },
                h("span", { class: "material-symbols-outlined" }, "close")),
            h("div", { class: "notif-body", "on:click": (e) => {
                    if (e.target.tagName.toLowerCase() !==
                        "button") {
                        this.callback(this);
                        this.close();
                    }
                } },
                h("div", { class: "notif-title" }, this.title),
                h("div", { class: "notif-description" }, this.description),
                h("div", { class: [
                        this.buttons.length > 0 && "notif-button-container",
                    ] }, this.buttons.map((value) => (h("button", { class: [
                        "notif-button",
                        `matter-button-${value.style || "contained"}`,
                    ], "on:click": () => {
                        value.callback(this);
                        if (typeof value.close ===
                            "undefined" ||
                            value.close === true) {
                            this.close();
                        }
                    } }, value.text)))))));
        this.timeout !== "never" &&
            setTimeout(() => {
                close();
            }, this.timeout);
    }
    async show() {
        const id = crypto.randomUUID();
        // initializing the elements
        const notifContainer = document.getElementsByClassName("notif-container")[0];
        const notif = document.createElement("div");
        notif.className = "notif";
        const notifBody = document.createElement("div");
        notifBody.className = "notif-body";
        const notifTitle = document.createElement("div");
        notifTitle.className = "notif-title";
        const notifDesc = document.createElement("div");
        notifDesc.className = "notif-description";
        if (this.closeIndicator) {
            const closeIndicator = document.createElement("div");
            closeIndicator.className = "notif-close-indicator";
            // temporary because im too lazy to make a span item properly, it's hardcoded so it's fine.
            closeIndicator.innerHTML =
                '<span class="material-symbols-outlined">close</span>';
            notif.appendChild(closeIndicator);
        }
        // assign relevant values
        notifTitle.innerText = this.title;
        notifDesc.innerText = this.description;
        notif.id = id;
        const callback = this.callback;
        notif.onclick = () => {
            deleteNotif();
            callback(this);
        };
        // adding the elements to the list
        notifBody.appendChild(notifTitle);
        notifBody.appendChild(notifDesc);
        notif.appendChild(notifBody);
        notifContainer?.appendChild(notif);
        // remove after period
        this.timeout !== "never" &&
            setTimeout(() => {
                deleteNotif();
            }, this.timeout);
        function deleteNotif() {
            const oldNotif = document.getElementById(id);
            // do nothing if the notification is already deleted
            if (oldNotif == null)
                return;
            oldNotif.style.opacity = "0";
            setTimeout(() => {
                notifContainer?.removeChild(oldNotif);
            }, 360);
        }
    }
}
//# sourceMappingURL=NotificationService.js.map