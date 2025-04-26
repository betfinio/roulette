declare const config: import("wagmi").Config<readonly [{
    blockExplorers: {
        readonly default: {
            readonly name: "PolygonScan";
            readonly url: "https://amoy.polygonscan.com";
            readonly apiUrl: "https://api-amoy.polygonscan.com/api";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 3127388;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 80002;
    name: "Polygon Amoy";
    nativeCurrency: {
        readonly name: "POL";
        readonly symbol: "POL";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc-amoy.polygon.technology"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}] | readonly [{
    blockExplorers: {
        readonly default: {
            readonly name: "PolygonScan";
            readonly url: "https://polygonscan.com";
            readonly apiUrl: "https://api.polygonscan.com/api";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xca11bde05977b3631167028862be2a173976ca11";
            readonly blockCreated: 25770160;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 137;
    name: "Polygon";
    nativeCurrency: {
        readonly name: "POL";
        readonly symbol: "POL";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://polygon-rpc.com"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}], {
    137: import("viem").FallbackTransport<readonly [import("viem").WebSocketTransport, import("viem").HttpTransport<undefined, false>, import("viem").HttpTransport<undefined, false>]>;
    80002: import("viem").FallbackTransport<readonly [import("viem").WebSocketTransport, import("viem").HttpTransport<undefined, false>, import("viem").HttpTransport<undefined, false>]>;
}, import("wagmi").CreateConnectorFn[]>;
export default config;
