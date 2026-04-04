import type { ExecutionResult } from 'graphql';
import type { Address } from 'viem';
import {
	execute,
	GetLiveRoulettePlayerTableBetsDocument,
	type GetLiveRoulettePlayerTableBetsQuery,
	GetLiveRouletteRoundBetsStatusSampleDocument,
	type GetLiveRouletteRoundBetsStatusSampleQuery,
	GetLiveRouletteRoundWinNumberDocument,
	type GetLiveRouletteRoundWinNumberQuery,
	GetLiveRouletteStatsByTableDocument,
	type GetLiveRouletteStatsByTableQuery,
	GetLiveRouletteTableRoundsDocument,
	type GetLiveRouletteTableRoundsQuery,
	GetLiveRouletteTableSelectedRoundBetsDocument,
	type GetLiveRouletteTableSelectedRoundBetsQuery,
	GetLiveRouletteTableSelectedRoundPlayersDocument,
	type GetLiveRouletteTableSelectedRoundPlayersQuery,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import { MULTIPLAYER_GAME, MULTIPLAYER_INTERVAL } from '@/src/global';
import { RoundStatus } from '../../shared/types';
import { getRouletteStat } from '..';
import type { PlayerInProgressBet, PlayerRoundBets, RouletteTable, RoundBet, RoundPlayerBet } from '../types';
import { WheelStatus } from '../types';

/** Same sentinel as `BetResultCell` / wheel UI — winning pocket not known yet */
export const LIVE_ROULETTE_WIN_UNKNOWN = 42;

function winStringFromGraphValue(v: unknown): string | undefined {
	if (v === undefined || v === null) return undefined;
	const s = String(v).trim();
	return s === '' ? undefined : s;
}

/** Resolved bet `result` wins over `Round.winNumber` (used when VRF wrote round but bets not settled). */
export function multiplayerHistoryDisplayWinNumber(result: unknown, roundWinNumber: unknown): number {
	const rs = winStringFromGraphValue(result);
	const rw = winStringFromGraphValue(roundWinNumber);
	if (rs !== undefined) {
		const n = Number(rs);
		if (!Number.isNaN(n)) return n;
	}
	if (rw !== undefined) {
		const n = Number(rw);
		if (!Number.isNaN(n)) return n;
	}
	return LIVE_ROULETTE_WIN_UNKNOWN;
}

/** Map subgraph `Round.status` to bet-style status for UI tables / LastResults */
function mapRoundEntityStatusToRoundStatus(status: string): RoundStatus {
	switch (status?.toLowerCase()) {
		case 'settled':
		case 'resolved':
			return RoundStatus.FINISHED;
		case 'cancelled':
			return RoundStatus.REFUNDED;
		default:
			return RoundStatus.CREATED;
	}
}

const mapStringStatusToRoundStatus = (status: string): RoundStatus => {
	switch (status) {
		case 'resolved':
		case 'settled':
			return RoundStatus.FINISHED;
		case 'refunded':
		case 'cancelled':
			return RoundStatus.REFUNDED;
		default:
			return RoundStatus.CREATED;
	}
};

export const fetchLiveRouletteTables = (): RouletteTable[] => {
	if (!MULTIPLAYER_GAME) return [];
	return [
		{
			address: MULTIPLAYER_GAME,
			interval: BigInt(MULTIPLAYER_INTERVAL),
			id: MULTIPLAYER_GAME,
		},
	];
};

export const fetchTablePlayerRounds = async (player: Address, table?: Address) => {
	if (table === undefined) return [];

	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetLiveRoulettePlayerTableBetsQuery> = await execute(GetLiveRoulettePlayerTableBetsDocument, { player, gameAddress: table });
	logger.success('fetching bets by player', data.data?.bets.length);
	if (data.data) {
		return data.data.bets.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				created: bet.blockTimestamp,
				winAmount: bet.payout != null && String(bet.payout) !== '' ? BigInt(typeof bet.payout === 'bigint' ? bet.payout : String(bet.payout)) : 0n,
				winNumber: multiplayerHistoryDisplayWinNumber(bet.result, bet.round?.winNumber),
				player: bet.player as Address,
				round: Number(bet.roundId),
				status: mapStringStatusToRoundStatus(bet.status),
				roundSubgraphStatus: bet.round?.status ?? null,
			} as RoundPlayerBet;
		});
	}
	return [];
};

/** One `RoundBet`-shaped row per on-chain round (not per player bet). Matches Watchers optimistic cache. */
export const fetchTableBets = async (table?: Address) => {
	if (!table) return [];
	logger.start('fetching rounds by table', table);
	const data: ExecutionResult<GetLiveRouletteTableRoundsQuery> = await execute(GetLiveRouletteTableRoundsDocument, { gameAddress: table, first: 1000 });
	logger.success('fetching rounds by table', data.data?.rounds.length);
	if (data.data?.rounds) {
		return data.data.rounds.map((round) => {
			return {
				amount: BigInt(round.totalBetAmount),
				created: round.started,
				winAmount: BigInt(round.totalPayout),
				winNumber: multiplayerHistoryDisplayWinNumber(undefined, round.winNumber),
				status: mapRoundEntityStatusToRoundStatus(round.status),
				round: Number(round.roundId),
				roundSubgraphStatus: round.status,
			} as RoundBet;
		});
	}
	return [];
};

export const fetchSelectedTableRoundPlayers = async (table?: Address, round?: number) => {
	logger.info('fetchSelectedTableRoundPlayers', table, round);
	if (table === undefined || round === undefined) return [];

	const data: ExecutionResult<GetLiveRouletteTableSelectedRoundPlayersQuery> = await execute(GetLiveRouletteTableSelectedRoundPlayersDocument, {
		gameAddress: table,
		roundId: round,
	});
	logger.success('fetchSelectedTableRoundPlayers data', data);
	if (data.data) {
		return data.data.bets.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				betCounts: Number(bet.chips.length),
				created: bet.blockTimestamp,
				player: bet.player as Address,
			} as PlayerRoundBets;
		});
	}
};

export const fetchTableSelectedRoundBets = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return [];

	const data: ExecutionResult<GetLiveRouletteTableSelectedRoundBetsQuery> = await execute(GetLiveRouletteTableSelectedRoundBetsDocument, {
		gameAddress: table,
		roundId: round,
	});
	if (data.data) {
		return data.data.bets.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.betAddress as Address,
				created: bet.blockTimestamp,
				player: bet.player as Address,
				chips: bet.chips.map((chip) => ({ bitMap: Number(chip.bitmap) })),
				winAmount: BigInt(bet.payout ?? 0n),
			} as PlayerInProgressBet;
		});
	}
	return [];
};

export const fetchLiveRouletteTableStats = async (table?: Address) => {
	if (!table) return;
	const data: ExecutionResult<GetLiveRouletteStatsByTableQuery> = await execute(GetLiveRouletteStatsByTableDocument, { gameAddress: table });
	try {
		logger.success('fetchLiveRouletteTableStats data', data);
		if (data.data) {
			const hot = data.data.hotNumbers.map((num) => num.number);
			const cold = data.data.coldNumbers.map((num) => num.number);

			const rouletteStat = getRouletteStat(data.data.rouletteStat.map((num) => ({ count: Number(num.count), number: Number(num.number) })));
			logger.success('rouletteStat', rouletteStat);

			return { ...rouletteStat, hot, cold };
		}
	} catch (error) {
		console.error('fetchLiveRouletteTableStats error', error);
		return;
	}
};

export const fetchRoundBank = async (table?: Address, round?: number): Promise<bigint> => {
	if (table === undefined || round === undefined) return 0n;
	const data: ExecutionResult<GetLiveRouletteRoundWinNumberQuery> = await execute(GetLiveRouletteRoundWinNumberDocument, {
		gameAddress: table,
		roundId: round,
	});
	const totalBetAmount = (data?.data?.rounds[0] as { totalBetAmount?: string } | undefined)?.totalBetAmount;
	return totalBetAmount ? BigInt(totalBetAmount) : 0n;
};

function liveBetRowImpliesRoundFinished(row: { status?: string | null; result?: unknown }): boolean {
	const s = row.status?.toLowerCase();
	if (s === 'settled' || s === 'resolved') return true;
	const r = row.result;
	if (r === undefined || r === null) return false;
	if (typeof r === 'bigint') return true;
	if (typeof r === 'number') return !Number.isNaN(r);
	return String(r) !== '';
}

async function fetchRoundHasFinishedEvidenceFromBets(table: Address, round: number): Promise<boolean> {
	const res: ExecutionResult<GetLiveRouletteRoundBetsStatusSampleQuery> = await execute(GetLiveRouletteRoundBetsStatusSampleDocument, {
		gameAddress: table,
		roundId: round,
	});
	const rows = res.data?.bets ?? [];
	return rows.some(liveBetRowImpliesRoundFinished);
}

export const fetchRoundStatus = async (table?: Address, round?: number): Promise<WheelStatus> => {
	if (table === undefined || round === undefined) return WheelStatus.NotExist;
	const data: ExecutionResult<GetLiveRouletteRoundWinNumberQuery> = await execute(GetLiveRouletteRoundWinNumberDocument, {
		gameAddress: table,
		roundId: round,
	});
	const roundRow = data?.data?.rounds[0];
	const status = roundRow?.status;
	const winNumberRaw = roundRow?.winNumber;
	const winNumberIndexed = winNumberRaw !== undefined && winNumberRaw !== null && String(winNumberRaw) !== '';
	// Indexer may lag updating rounds.status while winNumber is already written
	const treatSpinningAsFinished = status === 'spinning' && winNumberIndexed;

	let treatSpinningAsFinishedFromBets = false;
	if (status === 'spinning' && !treatSpinningAsFinished && table !== undefined && round !== undefined)
		treatSpinningAsFinishedFromBets = await fetchRoundHasFinishedEvidenceFromBets(table, round);

	if (treatSpinningAsFinished || treatSpinningAsFinishedFromBets) return WheelStatus.Finished;

	switch (status) {
		case 'open':
			return WheelStatus.Created;
		case 'spinning':
			return WheelStatus.Requested;
		case 'result_ready':
			return WheelStatus.ResultReadyAwaitingSettlement;
		case 'settled':
		case 'resolved':
			return WheelStatus.Finished;
		case 'cancelled':
			return WheelStatus.Refunded;
		default:
			return WheelStatus.NotExist;
	}
};

export const fetchSelectedTableRoundWinNumer = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return 42n;

	const data: ExecutionResult<GetLiveRouletteRoundWinNumberQuery> = await execute(GetLiveRouletteRoundWinNumberDocument, {
		gameAddress: table,
		roundId: round,
	});
	const winRaw = data?.data?.rounds[0]?.winNumber;
	if (winRaw !== undefined && winRaw !== null && String(winRaw) !== '') return BigInt(winRaw);
	return 42n; // sentinel: round not yet settled
};
