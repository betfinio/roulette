import {
	GetAllPlayerBetsDocument,
	type GetAllPlayerBetsQuery,
	GetPlayerBetsDocument,
	type GetPlayerBetsQuery,
	GetTableAllRoundsDocument,
	type GetTableAllRoundsQuery,
	GetTableBetsDocument,
	type GetTableBetsQuery,
	GetTablePlayerRoundsDocument,
	type GetTablePlayerRoundsQuery,
	GetTableSelectedRoundBetsDocument,
	type GetTableSelectedRoundBetsQuery,
	GetTransactionHashByBetDocument,
	type GetTransactionHashByBetQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import type { PlayerBet, PlayerInProgressBet, RoundBet } from '@/src/lib/roulette/types.ts';
import { ZeroAddress } from '@betfinio/abi';

import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';

export const fetchPlayerBets = async (player: Address, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetPlayerBetsQuery> = await execute(GetPlayerBetsDocument, { player, table });
	logger.success('fetching bets by player', data.data?.betEndeds.length);
	if (data.data) {
		return data.data.betEndeds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				transactionHash: bet.transactionHash,
				winAmount: BigInt(bet.winAmount),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};

export const fetchTableBets = async (table?: Address) => {
	if (!table) return [];
	logger.start('fetching bets by table', table);
	const data: ExecutionResult<GetTableBetsQuery> = await execute(GetTableBetsDocument, { table, first: 10 });
	logger.success('fetching bets by table', data.data?.betEndeds.length);
	if (data.data) {
		return data.data.betEndeds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				transactionHash: bet.transactionHash,
				winAmount: BigInt(bet.winAmount),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};
export const fetchAllPlayersBets = async (last: number, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetAllPlayerBetsQuery> = await execute(GetAllPlayerBetsDocument, { last, table });
	logger.success('fetching bets by player', data.data?.betEndeds.length);
	if (data.data) {
		return data.data.betEndeds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				transactionHash: bet.transactionHash,
				winAmount: BigInt(bet.winAmount),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};

export const fetchTablePlayerRounds = async (player: Address, table?: Address) => {
	if (table === undefined) return [];

	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetTablePlayerRoundsQuery> = await execute(GetTablePlayerRoundsDocument, { player, table });
	logger.success('fetching bets by player', data.data?.playerRoundEndeds.length);
	if (data.data) {
		return data.data.playerRoundEndeds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				transactionHash: bet.transactionHash,
				winAmount: BigInt(bet.winAmount),
				winNumber: Number(bet.winNumber),
				player: bet.player as Address,
			} as PlayerBet;
		});
	}
	return [];
};
export const fetchTableAllRounds = async (last: number, table?: Address) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetTableAllRoundsQuery> = await execute(GetTableAllRoundsDocument, { last, table });
	logger.success('fetching bets by player', data.data?.roundEndeds.length);
	if (data.data) {
		return data.data.roundEndeds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,
				transactionHash: bet.transactionHash,
				winAmount: BigInt(bet.winAmount),
				winNumber: Number(bet.winNumber),
			} as RoundBet;
		});
	}
	return [];
};

export const fetchTableSelectedRoundBets = async (table?: Address, round?: number) => {
	if (table === undefined || round === undefined) return [];

	const data: ExecutionResult<GetTableSelectedRoundBetsQuery> = await execute(GetTableSelectedRoundBetsDocument, { table, round });
	if (data.data) {
		return data.data.betPlaceds.map((bet) => {
			return {
				amount: BigInt(bet.amount),
				bet: bet.bet as Address,
				created: bet.blockTimestamp,

				player: bet.player as Address,
			} as PlayerInProgressBet;
		});
	}
	return [];
};
export const fetchTransactionHashByBet = async (bet: Address) => {
	logger.start('fetching transaction hash by bet', bet);
	const data: ExecutionResult<GetTransactionHashByBetQuery> = await execute(GetTransactionHashByBetDocument, { bet });
	logger.success('fetching transaction hash by bet', data.data?.betEndeds.length);
	if (data.data) {
		return data.data.betEndeds[0].transactionHash as Address;
	}
	return ZeroAddress;
};
