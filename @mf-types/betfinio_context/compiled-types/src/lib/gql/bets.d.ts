import type { BetWithHash } from '@/src/lib/types';
import type { Address } from 'viem';
export declare const getLastBets: (count: number) => Promise<BetWithHash[]>;
export declare const getPlayerBets: (count: number, player: Address) => Promise<BetWithHash[]>;
