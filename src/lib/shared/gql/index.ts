import type { ExecutionResult } from 'graphql';
import { type Address, getAddress } from 'viem';
import { execute, GetLiveRouletteBitMapByRoundDocument, type GetLiveRouletteBitMapByRoundQuery } from '@/.graphclient';
import logger from '@/src/config/logger';
import type { LocalBet } from '@/src/lib/shared/types.ts';
import { decodeBet } from '..';

function graphBytesToAddress(value: unknown): Address | undefined {
	if (value == null || typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	if (trimmed === '') return undefined;
	const hex = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;
	try {
		return getAddress(hex as `0x${string}`);
	} catch {
		return undefined;
	}
}

export const fetchBetsBitMapAndAmountByRound = async (table: Address, round: number): Promise<LocalBet[]> => {
	logger.start('fetch all bets by round and table', table, round);
	const data: ExecutionResult<GetLiveRouletteBitMapByRoundQuery> = await execute(GetLiveRouletteBitMapByRoundDocument, {
		gameAddress: table.toLowerCase() as Address,
		roundId: round,
	});
	let decoded: LocalBet[] = [];
	if (data.data) {
		logger.success('fetched all bets by round and table', data.data.bets);
		try {
			decoded = data.data.bets.flatMap((bet) => {
				const playerAddr = graphBytesToAddress(bet.player);
				const chips = bet.chips ?? [];
				return chips.map((chip) =>
					decodeBet({
						amount: BigInt(String(chip.amount ?? 0)),
						bitmap: BigInt(String(chip.bitmap ?? 0)),
						...(playerAddr ? { player: playerAddr } : {}),
					}),
				);
			});
		} catch {
			decoded = [];
		}
	}
	return decoded;
};
