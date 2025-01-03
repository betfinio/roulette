import type { Address } from 'viem';
import type { RoundStatus } from '../shared/types';

export interface PlayerInProgressBet {
	amount: bigint;
	bet: Address;
	created: bigint;
	player: Address;
}

export interface PlayerRoundBets {
	amount: bigint;
	betCounts: number;
	created: bigint;
	player: Address;
}

//this is summary of the round (can be in Progress)
export interface RoundBet {
	amount: bigint;
	created: bigint;
	round: number;
	winNumber: number;
	winAmount: bigint;
	status: RoundStatus;
}

//this is the player's summary of the round (can be in Progress)
export interface RoundPlayerBet {
	amount: bigint;
	player: Address;
	created: bigint;
	round: number;
	winNumber: number;
	winAmount: bigint;
	status: RoundStatus;
}
