import { type Config, type WriteContractReturnType } from '@wagmi/core';
import type { Address } from 'viem';
export declare const fetchBalance: (address: Address, config: Config, block?: bigint) => Promise<bigint>;
export declare const fetchAllowance: (address: Address | undefined, config: Config) => Promise<bigint>;
export declare const increaseAllowance: (config: Config) => Promise<WriteContractReturnType>;
