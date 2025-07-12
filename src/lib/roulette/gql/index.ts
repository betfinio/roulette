import { ZeroAddress } from '@betfinio/abi';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';
import {
	execute,
	GetRouletteAllPlayerBetsDocument,
	type GetRouletteAllPlayerBetsQuery,
	GetRoulettePlayerBetsDocument,
	type GetRoulettePlayerBetsQuery,
	GetRouletteStatsByTableDocument,
	type GetRouletteStatsByTableQuery,
	GetTransactionHashByBetDocument,
	type GetTransactionHashByBetQuery,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import type { PlayerBet } from '@/src/lib/roulette/types.ts';
import type { IRouletteStat } from '../../shared/types';

//This fetches my history
export const fetchPlayerBets = async (player: Address, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetRoulettePlayerBetsQuery> = await execute(GetRoulettePlayerBetsDocument, { player, table });
	logger.success('fetching bets by player', data.data?.playerRoundBetPlaceds_collection.length);
	if (data.data) {
		return data.data.playerRoundBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				status: Number(bet.status),
				winAmount: BigInt(bet.winAmount ?? 42n),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};

//this fetches all history
export const fetchAllPlayersBets = async (table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetRouletteAllPlayerBetsQuery> = await execute(GetRouletteAllPlayerBetsDocument, { last: 1000, table });
	logger.success('fetching bets by player', data.data?.roundBetPlaceds_collection.length);
	if (data.data) {
		return data.data.roundBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				winAmount: BigInt(bet.winAmount ?? 42n),
				winNumber: Number(bet.winNumber ?? 42n),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};

//this fetches random proof for history table modal
export const fetchTransactionHashByBet = async (bet: Address) => {
	logger.start('fetching transaction hash by bet', bet);
	const data: ExecutionResult<GetTransactionHashByBetQuery> = await execute(GetTransactionHashByBetDocument, { bet });
	logger.success('fetching transaction hash by bet', data.data?.betEndeds.length);
	if (data.data) {
		return data.data.betEndeds[0].transactionHash as Address;
	}
	return ZeroAddress;
};

export const fetchRouletteTableStats = async (player?: Address) => {
	if (!player) return;
	const data: ExecutionResult<GetRouletteStatsByTableQuery> = await execute(GetRouletteStatsByTableDocument, { player });
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
