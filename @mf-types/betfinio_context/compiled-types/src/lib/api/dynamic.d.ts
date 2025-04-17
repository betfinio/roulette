import type { Address } from 'viem';
import type { Config } from 'wagmi';
export declare const fetchTotalStaked: (config: Config, block?: bigint) => Promise<bigint>;
export declare const fetchTotalProfit: (config: Config) => Promise<bigint>;
export declare const fetchStaked: (config: Config, address: Address, block?: bigint) => Promise<bigint>;
