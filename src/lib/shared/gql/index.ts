import { GetLiveRouletteBitMapByRoundDocument, type GetLiveRouletteBitMapByRoundQuery, execute } from '@/.graphclient';
import type { ExecutionResult } from 'graphql';
import type { Address } from 'viem';
import { decodeBet } from '..';

export const fetchBetsBitMapAndAmountByRound = async (table: Address, round: number) => {
	const data: ExecutionResult<GetLiveRouletteBitMapByRoundQuery> = await execute(GetLiveRouletteBitMapByRoundDocument, { table, round });
	if (data.data) {
		return data.data.chips.flatMap((bet) => {
			return bet.chips.map((chip) => ({ amount: BigInt(chip.amount), bitmap: BigInt(chip.bitMap) })).map(decodeBet);
		});
	}
	return [];
};
