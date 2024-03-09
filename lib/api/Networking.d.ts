declare class Networking {
    libcurl: any;
    fetch: typeof fetch;
    WebSocket: typeof WebSocket;
    Socket: any;
    TLSSocket: any;
    constructor(wisp_server: string);
    setWispServer: (wisp_server: string) => void;
}
