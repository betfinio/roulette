import {
	GetTableMpEndedRoundsDocument,
	type GetTableMpEndedRoundsQuery,
	GetTableMpPlayerRoundsDocument,
	type GetTableMpPlayerRoundsQuery,
	GetTableSpEndedRoundsDocument,
	type GetTableSpEndedRoundsQuery,
	GetTableSpPlayerRoundsDocument,
	type GetTableSpPlayerRoundsQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import type { PlayerBet, TableBet } from '@/src/lib/roulette/types.ts';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';

//SinglePlayer
export const fetchSPPlayerRounds = async (player: Address, table?: Address, last = 50) => {
	console.log('table address');
	if (table === undefined) return [];
	logger.start('fetching bets by player', player);

	const data: ExecutionResult<GetTableSpPlayerRoundsQuery> = await execute(GetTableSpPlayerRoundsDocument, { player, table, last });

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

export const fetchSPEndedRounds = async (table?: Address, last = 50) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetTableSpEndedRoundsQuery> = await execute(GetTableSpEndedRoundsDocument, { last, table });
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
			} as TableBet;
		});
	}
	return [];
};

//Multiplayer
export const fetchMPPlayerEndedRounds = async (player: Address, table?: Address, last = 50) => {
	if (table === undefined) return [];
	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetTableMpPlayerRoundsQuery> = await execute(GetTableMpPlayerRoundsDocument, { player, table, last });
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
export const fetchMPEndedRounds = async (table?: Address, last = 50) => {
	if (table === undefined) return [];
	logger.start('fetching all bets');
	const data: ExecutionResult<GetTableMpEndedRoundsQuery> = await execute(GetTableMpEndedRoundsDocument, { last, table });
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
				//we need player for the single roulette(to display results in all bets)
				player: bet.player as Address,
			} as TableBet;
		});
	}
	return [];
};
