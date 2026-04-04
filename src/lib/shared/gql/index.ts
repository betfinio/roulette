import type { ExecutionResult } from 'graphql';
import type { Address } from 'viem';
import { execute, GetLiveRouletteBitMapByRoundDocument, type GetLiveRouletteBitMapByRoundQuery } from '@/.graphclient';
import logger from '@/src/config/logger';
import type { LocalBet } from '@/src/lib/shared/types.ts';
import { decodeBet } from '..';

export const fetchBetsBitMapAndAmountByRound = async (table: Address, round: number): Promise<LocalBet[]> => {
	logger.start('fetch all bets by round and table', table, round);
	const data: ExecutionResult<GetLiveRouletteBitMapByRoundQuery> = await execute(GetLiveRouletteBitMapByRoundDocument, { gameAddress: table, roundId: round });
	if (data.data) {
		logger.success('fetched all bets by round and table', data.data.bets);
		return data.data.bets.flatMap((bet) => {
			return bet.chips
				.map((chip) => ({ amount: BigInt(chip.amount), bitmap: BigInt(chip.bitmap), player: bet.player as Address }))
				.map(decodeBet)
				.map((bet) => ({ ...bet }));
		});
	}
	return [];
};
