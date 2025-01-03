import {
	GetRouletteAllPlayerBetsDocument,
	type GetRouletteAllPlayerBetsQuery,
	GetRoulettePlayerBetsDocument,
	type GetRoulettePlayerBetsQuery,
	GetTransactionHashByBetDocument,
	type GetTransactionHashByBetQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import type { PlayerBet } from '@/src/lib/roulette/types.ts';
import { ZeroAddress } from '@betfinio/abi';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';

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
export const fetchAllPlayersBets = async (last: number, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetRouletteAllPlayerBetsQuery> = await execute(GetRouletteAllPlayerBetsDocument, { last, table });
	logger.success('fetching bets by player', data.data?.roundBetPlaceds_collection.length);
	if (data.data) {
		return data.data.roundBetPlaceds_collection.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				winAmount: BigInt(bet.winAmount ?? 42n),
				winNumber: Number(bet.winNumber),
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
