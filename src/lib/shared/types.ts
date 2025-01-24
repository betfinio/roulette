import type { Address } from 'viem';

export interface ChipPlaceProps {
	item: string;
	numbers: number[];
}

export interface LocalBet {
	numbers: number[];
	amount: number;
	item: string;
	player?: Address;
}

export interface SpinParams {
	bets: LocalBet[];
	table: Address; //table address
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

export interface IRouletteStat {
	hot: number[];
	cold: number[];
	odd: number;
	even: number;
	red: number;
	black: number;
	totalRolls: number;
}
