import type { InviteCode, InviteRef, LinearData, MintResult } from '@/src/lib/types';
import type { Config } from '@wagmi/core';
import type { Address } from 'viem';
export declare const addressToColor: (walletAddress: Address) => string;
/**
 * Ref link formats
 * old(by address):
 * ?code=0x000...000 - just inviter
 * ?code=0x000...000&type=line - inviter with line
 * ?code=0x000...0000x000..000 - inviter with parent
 * ?code=0x000...0000x000..000&type=line - inviter with parent and line
 *
 * new(by id):
 * ?ref=777 - just inviter
 * ?ref=777L - inviter
 * ?ref=777L  - inviter with line to left
 * ?ref=777RS - inviter with line to right
 * ?ref=777P888 - inviter with parent
 * ?ref=777P888LS - inviter with parent and line to left
 * ?ref=777P888RS - inviter with parent and line to right
 *
 * format of new:
 * ([0-9]+)(P([0-9]+))?(L|R)?(S)?
 */
export declare const validateRef: (search: Record<string, unknown>) => {
    inviter: string;
    parent: string;
    type: string;
    side?: undefined;
} | {
    inviter: string;
    parent: string;
    type: string;
    side: string;
} | {
    inviter?: undefined;
    parent?: undefined;
    type?: undefined;
    side?: undefined;
};
export declare const handleCodeMint: (code: InviteCode, address: Address) => Promise<MintResult>;
export declare const handleRefMint: (ref: InviteRef, address: Address, config: Config) => Promise<MintResult>;
export declare const isMemberInMyLinearStructure: (memberPath: LinearData["path"], memberLinearLevel: number, me: Address) => boolean;
