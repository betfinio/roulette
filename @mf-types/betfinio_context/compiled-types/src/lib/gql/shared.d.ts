import type { Address } from 'viem';
export declare const fetchRegistrationDate: (address: Address) => Promise<number>;
export declare const getBlockByTimestamp: (timestamp: number) => Promise<bigint>;
