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
	item: number;
}

export interface SpinParams {
	bets: LocalBet[];
}

export interface FuncProps {
	item: number;
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

export interface WheelStopped {
	state: 'stopped';
	result: number;
	bet: Address;
}

export type WheelState = WheelSpinning | WheelLanded | WheelStandBy | WheelStopped;

export interface Limit {
	title: string;
	payout: number;
	min: bigint;
	max: bigint;
}
