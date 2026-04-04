import type { QueryClient } from '@tanstack/react-query';
import { readContract, simulateContract, writeContract } from '@wagmi/core';
import { type Address, parseAbiItem } from 'viem';
import { getBlockNumber, getLogs } from 'viem/actions';
import type { Config } from 'wagmi';
import { MULTIPLAYER_INTERVAL } from '@/src/global';
import { HouseMultiplayerGameABI } from '@/src/lib/abi';
import { WheelStatus } from '../types';

const randomnessFulfilledEvent = parseAbiItem('event RandomnessFulfilled(uint256 indexed requestId, uint256 indexed contextId, uint256 randomWord)');

/** `BaseGame.RoundStatus` on-chain (see betfin-core BaseGame.sol, HouseMultiplayerGame.sol) */
function mapChainRoundEnumToWheelStatus(chainStatus: number): WheelStatus {
	switch (chainStatus) {
		case 0:
			return WheelStatus.NotExist;
		case 1:
			return WheelStatus.Created;
		case 2:
			return WheelStatus.Requested;
		case 3:
			return WheelStatus.ResultReadyAwaitingSettlement;
		case 4:
			return WheelStatus.Finished;
		case 5:
			return WheelStatus.Refunded;
		default:
			return WheelStatus.NotExist;
	}
}

function toNumber(v: bigint | number): number {
	return typeof v === 'bigint' ? Number(v) : v;
}

/** Same as RouletteMultiplayerStrategy: winning European pocket is `randomWord % 37`. */
export function vrfWordToRouletteWinNumber(randomWord: bigint): number {
	return Number(randomWord % 37n);
}

export function cacheVrfWinNumberForRound(queryClient: QueryClient, table: Address, roundId: number, randomWord: bigint) {
	const n = vrfWordToRouletteWinNumber(randomWord);
	queryClient.setQueryData(['roulette', 'round', 'winNumber', table, roundId], BigInt(n));
}

/** When round is `ResultReady`, VRF word is in `RandomnessFulfilled` logs (not exposed on `getRound`). */
export async function fetchMultiplayerVrfWinNumberFromLogs(config: Config, game: Address, roundId: number): Promise<number | null> {
	const client = config.getClient();
	const latest = await getBlockNumber(client);
	const roundBig = BigInt(roundId);
	const ranges = [50_000n, 200_000n, 1_000_000n] as const;
	for (const span of ranges) {
		const fromBlock = latest > span ? latest - span : 0n;
		try {
			const logs = await getLogs(client, {
				address: game,
				event: randomnessFulfilledEvent,
				args: { contextId: roundBig },
				fromBlock,
				toBlock: latest,
			});
			const last = logs[logs.length - 1];
			const word = last?.args.randomWord;
			if (word !== undefined) return vrfWordToRouletteWinNumber(word);
		} catch {
			// RPC may reject wide ranges; try next span
		}
	}
	return null;
}

export const fetchCurrentRound = (interval: number) => {
	if (interval === 0) return 0;
	return Math.floor(Date.now() / 1000 / interval);
};

export const fetchCurrentRoundOfTable = async (_config: Config, _table?: Address) => {
	const interval = MULTIPLAYER_INTERVAL;
	const now = Math.floor(Date.now() / 1000);
	const round = BigInt(Math.floor(now / interval));
	return {
		round,
		interval: BigInt(interval),
		roundHasBets: false, // determined by subgraph query
	};
};

/** Authoritative round status when subgraph lags (e.g. still "spinning" while VRF is fulfilled on-chain). */
export async function fetchMultiplayerRoundWheelStatusFromChain(
	config: Config,
	table: Address,
	round: number,
): Promise<{ wheelStatus: WheelStatus; chainRoundStatus: number } | null> {
	try {
		const tuple = (await readContract(config, {
			abi: HouseMultiplayerGameABI,
			address: table,
			functionName: 'getRound',
			args: [BigInt(round)],
		})) as readonly [readonly Address[], bigint, bigint, bigint, bigint | number];
		const chainRoundStatus = toNumber(tuple[4]);
		return { wheelStatus: mapChainRoundEnumToWheelStatus(chainRoundStatus), chainRoundStatus };
	} catch {
		return null;
	}
}

/** Contract cap on bets processed per `settleRound` call; further payouts need another tx + click. */
export const MULTIPLAYER_SETTLE_BATCH = 50n;

/** One wallet signature per call — settles up to `MULTIPLAYER_SETTLE_BATCH` bets on this round. */
export async function settleMultiplayerRound(config: Config, table: Address, roundId: number): Promise<void> {
	const { request } = await simulateContract(config, {
		abi: HouseMultiplayerGameABI,
		address: table,
		functionName: 'settleRound',
		args: [BigInt(roundId), MULTIPLAYER_SETTLE_BATCH],
	});
	await writeContract(config, request);
}
