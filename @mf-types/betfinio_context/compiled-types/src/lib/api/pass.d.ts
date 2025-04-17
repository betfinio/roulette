import { type Config } from '@wagmi/core';
import type { Address, WriteContractReturnType } from 'viem';
export declare const isMember: (address: Address | undefined, config: Config) => Promise<boolean>;
export declare const mint: (address: Address, inviter: Address, parent: Address, config: Config) => Promise<WriteContractReturnType>;
export declare const fetchPassHolder: (passId: bigint, config: Config) => Promise<`0x${string}`>;
