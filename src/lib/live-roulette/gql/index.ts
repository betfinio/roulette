import {
	GetLiveRoulettePlayerTableBetsDocument,
	type GetLiveRoulettePlayerTableBetsQuery,
	GetLiveRouletteTableAllBetsDocument,
	type GetLiveRouletteTableAllBetsQuery,
	GetLiveRouletteTableSelectedRoundBetsDocument,
	type GetLiveRouletteTableSelectedRoundBetsQuery,
	GetLiveRouletteTableSelectedRoundPlayersDocument,
	type GetLiveRouletteTableSelectedRoundPlayersQuery,
	GetLiveRouletteTablesDocument,
	type GetLiveRouletteTablesQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import type { ExecutionResult } from 'graphql';
import type { Address } from 'viem';
import type { PlayerInProgressBet, PlayerRoundBets, RouletteTable, RoundBet, RoundPlayerBet } from '../types';

export const fetchTablePlayerRounds = async (player: Address, table?: Address) => {
	if (table === undefined) return [];

	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetLiveRoulettePlayerTableBetsQuery> = await execute(GetLiveRoulettePlayerTableBetsDocument, { player, table });
	logger.success('fetching bets by player', data.data?.playerRoundBetPlaceds_collection.length);
	if (data.data) {
		return data.data.playerRoundBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				created: bet.blockTimestamp,
				winAmount: BigInt(bet.winAmount ?? 42n),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
				round: Number(bet.round),
				status: Number(bet.status),
			} as RoundPlayerBet;
		});
	}
	return [];
};

export const fetchTableBets = async (last: number, table?: Address) => {
	if (!table) return [];
	logger.start('fetching bets by table', table);
	const data: ExecutionResult<GetLiveRouletteTableAllBetsQuery> = await execute(GetLiveRouletteTableAllBetsDocument, { table, first: last });
	logger.success('fetching bets by table', data.data?.roundBetPlaceds_collection.length);
	if (data.data) {
		return data.data.roundBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				created: bet.blockTimestamp,
				winAmount: BigInt(bet.winAmount ?? 42n),
				winNumber: Number(bet.winNumber),
				status: Number(bet.status),
				round: Number(bet.round),
			} as RoundBet;
		});
	}
	return [];
};

export const fetchSelectedTableRoundPlayers = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return [];

	const data: ExecutionResult<GetLiveRouletteTableSelectedRoundPlayersQuery> = await execute(GetLiveRouletteTableSelectedRoundPlayersDocument, {
		table,
		round,
	});
	if (data.data) {
		return data.data.playerRoundBetPlaceds_collection.map((players) => {
			return {
				amount: BigInt(players.amount),
				betCounts: Number(players.betsCount),
				created: players.blockTimestamp,
				player: players.player as Address,
			} as PlayerRoundBets;
		});
	}
};

export const fetchTableSelectedRoundBets = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return [];

	const data: ExecutionResult<GetLiveRouletteTableSelectedRoundBetsQuery> = await execute(GetLiveRouletteTableSelectedRoundBetsDocument, { table, round });
	if (data.data) {
		return data.data.playerRoundSingleBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				player: bet.player as Address,
				chips: bet.chips.map((chip) => ({ bitMap: Number(chip.bitMap) })),
				winAmount: BigInt(bet.winAmount),
			} as PlayerInProgressBet;
		});
	}
	return [];
};

export const fetchLiveRouletteTables = async (): Promise<RouletteTable[]> => {
	const data: ExecutionResult<GetLiveRouletteTablesQuery> = await execute(GetLiveRouletteTablesDocument, {});
	if (data.data) {
		const uniqueIntervals = new Set<bigint>(); // To track unique intervals

		return data.data.tables
			.map((table) => {
				return {
					address: table.address,
					interval: table.interval,
					id: table.id,
				} as RouletteTable;
			})
			.filter((table) => {
				if (!uniqueIntervals.has(table.interval)) {
					uniqueIntervals.add(table.interval);
					return true;
				}
				return false;
			});
	}
	return [];
};
