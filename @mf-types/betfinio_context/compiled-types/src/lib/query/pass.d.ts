import type { Address } from 'viem';
export declare const useIsMember: (address: Address | undefined) => import("@tanstack/react-query").UseQueryResult<boolean, Error>;
export declare const useMint: () => import("@tanstack/react-query").UseMutationResult<`0x${string}`, unknown, {
    address: Address;
    inviter: Address;
    parent: Address;
}, unknown>;
export declare const usePassId: (address?: Address) => import("@tanstack/react-query").UseQueryResult<bigint, Error>;
