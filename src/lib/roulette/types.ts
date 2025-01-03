import type { BetInterface } from 'betfinio_app/lib/types';
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
