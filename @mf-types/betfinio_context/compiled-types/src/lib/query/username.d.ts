import type { Address } from 'viem';
export declare const useUsername: (address: Address, user?: Address) => import("@tanstack/react-query").UseQueryResult<string, Error>;
export declare const useCustomUsername: (address: Address | undefined, user: Address | undefined) => import("@tanstack/react-query").UseQueryResult<"" | undefined, Error>;
export declare const useChangeUsername: () => import("@tanstack/react-query").UseMutationResult<boolean, Error, string, unknown>;
export declare const useChangeCustomUsername: () => import("@tanstack/react-query").UseMutationResult<boolean, Error, {
    username: string;
    address: Address;
}, unknown>;
