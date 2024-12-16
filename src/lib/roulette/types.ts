import type { BetInterface } from 'betfinio_app/lib/types';
import type { Address } from 'viem';

export interface RouletteBet extends BetInterface {
	requestId: bigint;
	winNumber: number;
	bets: RouletteSubBet[];
}

export interface RouletteSubBet {
	bitmap: bigint;
	amount: bigint;
}

export interface LocalBet {
	numbers: number[];
	amount: number;
	item: string;
}

export interface SpinParams {
	bets: LocalBet[];
	tableAddress: Address; //table address
	roundNumber: bigint; //round number
	playerAddress: Address; //player address
}

export interface ChiPlaceProps {
	item: string;

	numbers: number[];
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
	bet: Address;
}
export interface WheelLanding {
	state: 'landing';
	result: number;
	bet: Address;
}

export interface WheelStopped {
	state: 'stopped';
	result: number;
	bet: Address;
}

export type WheelState = WheelSpinning | WheelLanded | WheelStandBy | WheelStopped | WheelLanding;

export interface Limit {
	title: string;
	payout: number;
	min: bigint;
	max: bigint;
}

export interface PlayerBets {
	amount: bigint;
	bet: Address;
	created: bigint;
	winNumber: number;
	winAmount: bigint;
	transactionHash: Address;
	player: Address;
}

export interface RoundBet {
	amount: bigint;
	bet: Address;
	created: bigint;

	transactionHash: Address;
	player: Address;
}
