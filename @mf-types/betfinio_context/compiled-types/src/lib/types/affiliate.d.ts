import type { Address } from 'viem';
export interface Member {
    member: Address;
    inviter: Address;
    parent: Address;
    left: Address;
    right: Address;
    count: {
        left: number;
        right: number;
    };
    volume: {
        left: bigint;
        right: bigint;
        member: bigint;
    };
    bets: {
        left: bigint;
        right: bigint;
        member: bigint;
    };
    matched: {
        left: bigint;
        right: bigint;
    };
    is: {
        matching: boolean;
        inviting: boolean;
    };
}
export interface TreeMember {
    member: Address;
    parent: Address;
    inviter: Address;
    side: string;
    left: Address | null;
    right: Address | null;
    isMatching: boolean;
    isInviting: boolean;
    volume: bigint;
    volumeLeft: bigint;
    volumeRight: bigint;
    volumeDirect: bigint;
    volumeLinear: bigint;
    bets: bigint;
    betsLeft: bigint;
    betsRight: bigint;
    matchedLeft: bigint;
    matchedRight: bigint;
    countLeft: bigint;
    countRight: bigint;
    countDirect: bigint;
    countLinear: bigint;
    betsDirect: bigint;
    betsLinear: bigint;
    stakingDirect: bigint;
    stakingLinear: bigint;
    linearLevel: number;
    path: LinearData['path'];
}
export interface BalanceInfo {
    total: bigint;
    claimed: bigint;
    claimable: bigint;
    claimableDaily?: bigint;
}
export interface Balance {
    bets: BalanceInfo;
    staking: BalanceInfo;
    matching: BalanceInfo;
}
export interface Claim {
    timestamp: number;
    amount: bigint;
    transaction: Address;
}
export declare const defaultTreeMember: TreeMember;
export type TSide = 'left' | 'right' | null;
export type InviteCode = Partial<{
    inviter: Address;
    parent: Address;
    type: string;
}>;
export type InviteRef = Partial<{
    inviter: number;
    parent: number;
    type: 'S' | 'N';
    side: 'L' | 'R';
}>;
export type MintResult = {
    error: string;
} | {
    address: Address;
    inviter: Address;
    parent: Address;
};
export interface LinearData {
    member: Address;
    linearLevel: number;
    path: {
        member: Address;
        linearData: {
            linearLevel: number;
        };
    }[];
}
