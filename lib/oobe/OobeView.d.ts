/// <reference types="dreamland" />
declare class OobeView {
    state: Stateful<{
        color: string;
        text: string;
        step: number;
    }>;
    css: string;
    steps: {
        elm: JSX.Element;
        on: () => void;
    }[];
    element: JSX.Element;
    nextStep(): void;
    complete(): void;
}
declare function installx86(): Promise<void>;
declare function preloadFiles(): Promise<void>;
