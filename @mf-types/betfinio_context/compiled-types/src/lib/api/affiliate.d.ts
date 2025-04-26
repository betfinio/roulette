import type { Address } from 'viem';
import type { Config } from 'wagmi';
export declare const fetchInviteStakingVolume: (member: Address, config: Config) => Promise<bigint>;
export declare const fetchInviteBettingVolume: (member: Address, config: Config) => Promise<bigint>;
export declare const fetchInviteCondition: (config: Config) => Promise<bigint>;
export declare const fetchMemberInviteesCount: (member: Address, config: Config) => Promise<number>;
