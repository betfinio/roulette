import {
	GetAllPlayerBetsDocument,
	type GetAllPlayerBetsQuery,
	GetPlayerBetsDocument,
	type GetPlayerBetsQuery,
	type Landed,
	RouletteAllLandedsDocument,
	type RouletteAllLandedsQuery,
	RouletteMyLandedsDocument,
	type RouletteMyLandedsQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import { ROULETTE } from '@/src/global.ts';
import type { PlayerBets, RouletteBet } from '@/src/lib/roulette/types.ts';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';

export const fetchPlayerBets = async (player: Address) => {
	logger.start('fetching bets by player', player);
	const data: ExecutionResult<GetPlayerBetsQuery> = await execute(GetPlayerBetsDocument, { player });
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
			} as PlayerBets;
		});
	}
	return [];
};
export const fetchAllPlayersBets = async (last: number) => {
	logger.start('fetching all bets');
	const data: ExecutionResult<GetAllPlayerBetsQuery> = await execute(GetAllPlayerBetsDocument, { last });
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
			} as PlayerBets;
		});
	}
	return [];
};
