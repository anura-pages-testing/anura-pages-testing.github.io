declare const bare: any;
declare class TLSClient extends bare.Client {
    queue: never[];
    canstart: boolean;
    constructor();
    request(method: any, requestHeaders: any, body: any, remote: {
        href: any;
    }, cache: any, duplex: any, signal: any, arrayBufferImpl: any): Promise<Response>;
    connect(remote: {
        toString: () => any;
    }, protocols: string | Iterable<unknown> | ArrayLike<unknown> | undefined, getRequestHeaders: any, onMeta: any, onReadyState: (arg0: number) => void, webSocketImpl: any, arrayBufferImpl: {
        prototype: any;
    }): WebSocket;
}
