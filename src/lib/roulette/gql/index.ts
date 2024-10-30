import {
	type Landed,
	RouletteAllLandedsDocument,
	type RouletteAllLandedsQuery,
	RouletteMyLandedsDocument,
	type RouletteMyLandedsQuery,
	execute,
} from '@/.graphclient';
import logger from '@/src/config/logger';
import { ROULETTE } from '@/src/global.ts';
import type { RouletteBet } from '@/src/lib/roulette/types.ts';
import type { ExecutionResult } from 'graphql/execution';
import type { Address } from 'viem';

export const fetchBetsByPlayer = async (address: Address): Promise<RouletteBet[]> => {
	logger.start('[roulette]', 'fetching bets by player', address);
	const data: ExecutionResult<RouletteMyLandedsQuery> = await execute(RouletteMyLandedsDocument, { address });
	console.log(data.data?.landeds);
	logger.success('[roulette]', 'fetching bets by player', data.data?.landeds.length);
	if (data.data) {
		return data.data.landeds.map(populateBet);
	}
	return [];
};

export const fetchAllBets = async (count = 10): Promise<RouletteBet[]> => {
	logger.start('[roulette]', 'fetching bets all bets');
	const data: ExecutionResult<RouletteAllLandedsQuery> = await execute(RouletteAllLandedsDocument, {});
	console.log(data.data?.landeds);
	logger.success('[roulette]', 'fetching bets all bets', data.data?.landeds.length);
	if (data.data) {
		return data.data.landeds.map(populateBet);
	}
	return [];
};

export function populateBet(
	landed: Pick<Landed, 'player' | 'bet' | 'result' | 'requestId' | 'winAmount' | 'betAmount' | 'blockTimestamp' | 'transactionHash'>,
): RouletteBet {
	return {
		requestId: BigInt(landed.requestId),
		winNumber: Number(landed.result),
		player: landed.player,
		address: landed.bet,
		game: ROULETTE,
		hash: landed.transactionHash,
		result: BigInt(landed.winAmount),
		amount: BigInt(landed.betAmount),
		created: landed.blockTimestamp,
	} as RouletteBet;
}
