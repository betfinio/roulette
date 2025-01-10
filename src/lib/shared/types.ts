import type { Address } from 'viem';

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

export enum RoundStatus {
	CREATED = 1,
	FINISHED = 2,
	REFUNDED = 3,
}

export interface LastResult {
	winNumber: number;
	status: RoundStatus;
}
