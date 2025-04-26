import type { Address } from 'viem';
export interface Stat {
    time: number;
    value: number;
}
export type Timeframe = 'hour' | 'day' | 'week';
export interface Stake {
    start: number;
    end: number;
    staker: Address;
    pool: Address;
    amount: bigint;
    ended: boolean;
    hash?: Address;
    staking?: string;
    reward?: bigint;
    block?: number;
    username?: string;
    customUsername?: string;
}
export interface IStake {
    staker: Address;
    address: Address;
    amount: bigint;
    transactionHash: Address;
}
