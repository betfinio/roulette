import type { BetInterface } from 'betfinio_context/lib/types';
import type { Address } from 'viem';
import type { RoundStatus } from '../shared/types';

export interface RouletteBet extends BetInterface {
	requestId: bigint;
	winNumber: number;
	bets: RouletteSubBet[];
}

export interface RouletteSubBet {
	bitmap: bigint;
	amount: bigint;
}

export interface PlayerBet {
	amount: bigint;
	bet: Address;
	created: bigint;
	winNumber: number;
	winAmount: bigint;
	player: Address;
	status: RoundStatus;
}

export interface WheelStandBy {
	state: 'standby';
}

export interface WheelSpinning {
	state: 'spinning';
}

export interface WheelLanded {
	state: 'landed';
	result: number;
	bet: PlayerBet;
}
export interface WheelLanding {
	state: 'landing';
	result: number;
	bet: PlayerBet;
}

export type WheelState = WheelSpinning | WheelLanded | WheelStandBy | WheelLanding;
