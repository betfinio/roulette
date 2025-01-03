import type { Address } from 'viem';
import type { RoundBet, RoundPlayerBet } from '../live-roulette/types';
import type { PlayerBet } from '../roulette/types';

export interface ChiPlaceProps {
	item: string;
	numbers: number[];
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

export interface Limit {
	title: string;
	payout: number;
	min: bigint;
	max: bigint;
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
	bet?: PlayerBet;
	tableRound?: RoundBet;
	tablePlayerRound?: RoundPlayerBet;
}
export interface WheelLanding {
	state: 'landing';
	result: number;
	bet?: PlayerBet;
	tableRound?: RoundBet;
	tablePlayerRound?: RoundPlayerBet;
}

export interface WheelStopped {
	state: 'stopped';
	result: number;
	bet: PlayerBet;
}

export type WheelState = WheelSpinning | WheelLanded | WheelStandBy | WheelStopped | WheelLanding;

export enum RoundStatus {
	CREATED = 1,
	FINISHED = 2,
	REFUNDED = 3,
}

export interface LastResult {
	winNumber: number;
	status: RoundStatus;
}
