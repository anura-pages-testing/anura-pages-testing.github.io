/// <reference types="dreamland" />
declare class AnuraUI {
    /**
     * This map contains all the built-in components that have been registered.
     */
    builtins: Map<string, Component<any, any, any>>;
    /**
     * This map contains all the components that have been registered from external libraries.
     */
    components: Map<string, {
        lib: string;
        name: string;
    }>;
    /**
     * This function allows you to register a component to the built-in components registry.
     * @param component - The name of the component to register.
     * @param element - A function component that returns an HTMLElement.
     */
    registerComponent<TPublic, TPrivate, TConstructed extends string | number | symbol = never>(component: string, element: Component<TPublic, TPrivate, TConstructed>): Promise<void>;
    /**
     * This function allows you to register a component from an external library.
     * @param lib - The name of the library to import the component from.
     * @param component - The name of the component to register.
     * @param version - (Optional) The version of the library to import the component from.
     */
    registerExternalComponent(lib: string, component: string, version?: string): Promise<any>;
    /**
     * This function allows you to import a component, whether it is a built-in component or a component from a library.
     * @param name - The name of the component to import.
     * @returns A promise that resolves to a function component that returns an HTMLElement.
     */
    get<TPublic, TPrivate, TConstructed extends string | number | symbol = never>(name: string): Promise<Component<TPublic, TPrivate, TConstructed>>;
    /**
     * This function allows you to check if a component is registered.
     * @param component - The name of the component to check.
     * @returns Whether the component is registered or not.
     */
    exists(component: string): boolean;
    /**
     * This function allows you to import multiple components at once.
     *
     * @param components - An array of component names to import, or a singular component. If you pass "*" it will import all components.
     * @returns A promise that resolves to an object containing the components.
     *
     * @example
     *
     * ```jsx
     * const { Button } = await anura.ui.use("Button");
     *
     * document.body.appendChild(<Button onclick={() => {
     *   alert("Hello, World!");
     * }} />);
     * ```
     *
     * @example <caption>Without jsx</caption>
     *
     * ```js
     * const { Button, } = await anura.ui.use(["Button", "Input"]);
     *
     * // Here we supply the props to the component by binding the props object to the component.
     * let boundButton = Button.bind({
     *            "onclick": () => {
     *              alert("Hello, World!");
     *            }
     * });
     *
     * document.body.appendChild(boundButton);
     * ```
     */
    use<TPublic, TPrivate, TConstructed extends string | number | symbol = never>(components?: string[] | string | "*"): Promise<{
        [key: string]: Component<TPublic, TPrivate, TConstructed>;
    }>;
    /**
     * This function initializes the UI API with the list of components.
     * It is called on boot, and should not be called manually.
     */
    init(): void;
}
