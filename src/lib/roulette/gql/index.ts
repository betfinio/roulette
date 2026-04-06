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
import { SINGLE_PLAYER_GAME } from '@/src/global';
import type { PlayerBet } from '@/src/lib/roulette/types.ts';
import { RoundStatus } from '@/src/lib/shared/types';
import type { IRouletteStat } from '../../shared/types';

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

//This fetches my history
export const fetchPlayerBets = async (player: Address, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetRoulettePlayerBetsQuery> = await execute(GetRoulettePlayerBetsDocument, { player, gameAddress: table });
	logger.success('fetching bets by player', data.data?.bets.length);
	if (data.data) {
		return data.data.bets.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.betAddress as Address,
				created: bet.blockTimestamp,
				status: mapStringStatusToRoundStatus(bet.status),
				winAmount: BigInt(bet.payout ?? 42n),
				winNumber: Number(bet.result ?? 0),
				player: player,
			} as PlayerBet;
		});
	}
	return [];
};

//this fetches all history
export const fetchAllPlayersBets = async (table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetRouletteAllPlayerBetsQuery> = await execute(GetRouletteAllPlayerBetsDocument, { last: 1000, gameAddress: table });
	logger.success('fetching bets by player', data.data?.bets.length);
	if (data.data) {
		return data.data.bets.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.betAddress as Address,
				created: bet.blockTimestamp,
				winAmount: BigInt(bet.payout ?? 42n),
				winNumber: Number(bet.result ?? 42),
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
	logger.success('fetching transaction hash by bet', data.data?.bets.length);
	if (data.data) {
		return data.data.bets[0].transactionHash as Address;
	}
	return ZeroAddress;
};

export const fetchRouletteTableStats = async (gameAddress?: Address): Promise<IRouletteStat | null> => {
	const resolvedGameAddress = gameAddress ?? SINGLE_PLAYER_GAME;
	if (!resolvedGameAddress) return null;
	const data: ExecutionResult<GetRouletteStatsByTableQuery> = await execute(GetRouletteStatsByTableDocument, { gameAddress: resolvedGameAddress });
	if (data.data?.rouletteStat[0]) {
		const hot = data.data.hotNumbers.map((num) => num.number);
		const cold = data.data.coldNumbers.map((num) => num.number);
		const odd = Number(data.data.rouletteStat[0].oddCount);
		const even = Number(data.data.rouletteStat[0].evenCount);
		const red = Number(data.data.rouletteStat[0].redCount);
		const black = Number(data.data.rouletteStat[0].blackCount);
		const totalRolls = Number(data.data.rouletteStat[0].totalRolls);
		if (totalRolls === 0) return null; // no bets yet → hide the stat panel
		return {
			hot,
			cold,
			odd: Math.floor((odd / totalRolls) * 100),
			even: Math.floor((even / totalRolls) * 100),
			red: Math.floor((red / totalRolls) * 100),
			black: Math.floor((black / totalRolls) * 100),
			totalRolls,
		};
	}
	return null;
};
