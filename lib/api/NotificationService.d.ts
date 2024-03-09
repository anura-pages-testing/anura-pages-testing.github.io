/// <reference types="dreamland" />
declare class NotificationService {
    element: JSX.Element;
    notifications: AnuraNotification[];
    constructor();
    add(params: NotifParams): void;
    remove(notification: AnuraNotification): void;
}
interface NotifParams {
    title?: string;
    description?: string;
    timeout?: number | "never";
    callback?: (notif: AnuraNotification) => void;
    closeIndicator?: boolean;
    buttons?: Array<{
        text: string;
        style?: "contained" | "outlined" | "text";
        callback: (notif: AnuraNotification) => void;
        close?: boolean;
    }>;
}
declare class AnuraNotification {
    title: string;
    description: string;
    timeout: number | "never";
    closeIndicator: boolean;
    callback: (_notif: AnuraNotification) => null;
    buttons: Array<{
        text: string;
        style?: "contained" | "outlined" | "text";
        callback: (notif: AnuraNotification) => void;
    }>;
    close: () => void;
    element: HTMLElement;
    constructor(params: NotifParams, close: () => void);
    show(): Promise<void>;
}
