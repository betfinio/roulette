import type { Address } from 'viem';
export interface BetInterface {
    address: Address;
    player: Address;
    game: string;
    amount: bigint;
    result: bigint;
    status: bigint;
    created: bigint;
    hash?: Address;
    username?: string;
    customUsername?: string;
}
export interface BetWithHash {
    address: Address;
    hash: Address;
}
