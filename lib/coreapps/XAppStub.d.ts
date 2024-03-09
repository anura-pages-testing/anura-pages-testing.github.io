declare class XAppStub extends App {
    command: string;
    constructor(name: string, packageIdent: string, icon: string, command: string);
    open(): Promise<void>;
}
