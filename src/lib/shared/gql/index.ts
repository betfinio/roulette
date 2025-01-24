import { GetLiveRouletteBitMapByRoundDocument, type GetLiveRouletteBitMapByRoundQuery, execute } from '@/.graphclient';
import logger from '@/src/config/logger';
import type { LocalBet } from '@/src/lib/shared/types.ts';
import type { ExecutionResult } from 'graphql';
import type { Address } from 'viem';
import { decodeBet } from '..';

export const fetchBetsBitMapAndAmountByRound = async (table: Address, round: number): Promise<LocalBet[]> => {
	logger.start('fetch all bets by round and table', table, round);
	const data: ExecutionResult<GetLiveRouletteBitMapByRoundQuery> = await execute(GetLiveRouletteBitMapByRoundDocument, { table, round });
	if (data.data) {
		logger.success('fetched all bets by round and table', data.data.chips);
		return data.data.chips.flatMap((bet) => {
			return bet.chips
				.map((chip) => ({ amount: BigInt(chip.amount), bitmap: BigInt(chip.bitMap), player: chip.player as Address }))
				.map(decodeBet)
				.map((bet) => ({ ...bet }));
		});
	}
	return [];
};
