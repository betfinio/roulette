import type { Address } from 'viem';
import type { RoundStatus } from '../shared/types';

export interface PlayerInProgressBet {
	amount: bigint;
	bet: Address;
	created: bigint;
	player: Address;
	chips: {
		bitMap: number;
	}[];
	winAmount?: bigint;
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
	/** Subgraph `Round.status` (multiplayer): e.g. spinning, result_ready, settled */
	roundSubgraphStatus?: string | null;
}

//this is the player's summary of the round (can be in Progress)
export interface RoundPlayerBet extends RoundBet {
	player: Address;
}

export interface WheelState {
	state: WheelStatus;
	result?: number;
	tableRound?: RoundBet;
	tablePlayerRound?: RoundPlayerBet;
	tableSelectedRoundBets?: PlayerInProgressBet[];
}

// 0 - not exists, 1 - created, 2 - requested, 3 - finished, 4 - refunded
export enum WheelStatus {
	Loading = -1,
	NotExist = 0,
	Created = 1,
	Requested = 2,
	Landing = 2.5, //operational status, just to extend smart contract status
	JustFinished = 2.75, //operational status, just to extend smart contract status
	Finished = 3,
	Refunded = 4,
	/** On-chain `RoundStatus.ResultReady` — VRF done (`randomWord % 37` is final); `settleRound` still needed for payouts */
	ResultReadyAwaitingSettlement = 6,
}

export interface RouletteTable {
	address: Address;
	interval: bigint;
	id: string;
}
