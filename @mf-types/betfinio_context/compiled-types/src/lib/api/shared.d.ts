import type { BetInterface, BetWithHash } from '@/src/lib/types';
import type { Address } from 'viem';
import type { Config } from 'wagmi';
export declare const fetchLastBets: (count: number, config: Config) => Promise<BetInterface[]>;
export declare const fetchPlayerBets: (count: number, player: Address, config: Config) => Promise<BetInterface[]>;
export declare function fetchBetInterface(bet: BetWithHash, config: Config): Promise<BetInterface>;
export declare const getBetsDifference: (config: Config, beforeBlock: bigint, gameAddress: Address) => Promise<number>;
