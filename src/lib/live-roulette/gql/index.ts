import {
	GetLiveRoulettePlayerTableBetsDocument,
	type GetLiveRoulettePlayerTableBetsQuery,
	GetLiveRouletteRoundWinNumberDocument,
	type GetLiveRouletteRoundWinNumberQuery,
	GetLiveRouletteStatsByTableDocument,
	type GetLiveRouletteStatsByTableQuery,
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
import type { IRouletteStat } from '../../shared/types';
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

export const fetchTableBets = async (table?: Address) => {
	if (!table) return [];
	logger.start('fetching bets by table', table);
	const data: ExecutionResult<GetLiveRouletteTableAllBetsQuery> = await execute(GetLiveRouletteTableAllBetsDocument, { table, first: 1000 });
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
		console.log(data.data);

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
			})
			.filter((table) => (import.meta.env.PUBLIC_ENVIRONMENT === 'development' ? true : BigInt(table.interval) === 90n || BigInt(table.interval) === 180n));
	}
	return [];
};
export const fetchLiveRouletteTableStats = async (table?: Address) => {
	if (!table) return;
	const data: ExecutionResult<GetLiveRouletteStatsByTableQuery> = await execute(GetLiveRouletteStatsByTableDocument, { table });
	if (data.data) {
		const hot = data.data.hotNumbers.map((num) => num.number);
		const cold = data.data.coldNumbers.map((num) => num.number);
		const odd = Number(data.data.rouletteStat[0].oddCount);
		const even = Number(data.data.rouletteStat[0].evenCount);
		const red = Number(data.data.rouletteStat[0].redCount);
		const black = Number(data.data.rouletteStat[0].blackCount);
		const totalRolls = Number(data.data.rouletteStat[0].totalRolls);
		const rouletteStat: IRouletteStat = {
			hot,
			cold,
			odd: Math.floor((odd / totalRolls) * 100),
			even: Math.floor((even / totalRolls) * 100),
			red: Math.floor((red / totalRolls) * 100),
			black: Math.floor((black / totalRolls) * 100),
			totalRolls,
		};

		return rouletteStat;
	}
};

export const fetchSelectedTableRoundWinNumer = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return 42n;

	const data: ExecutionResult<GetLiveRouletteRoundWinNumberQuery> = await execute(GetLiveRouletteRoundWinNumberDocument, {
		table,
		round,
	});
	if (data?.data?.roundBetPlaceds_collection[0].winNumber) {
		const winNumber = data.data.roundBetPlaceds_collection[0].winNumber;
		return BigInt(winNumber);
	}
};
