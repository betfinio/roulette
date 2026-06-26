import { multicall, simulateContract, writeContract } from '@wagmi/core';
import type { TFunction } from 'i18next';
import { type Address, encodeAbiParameters, parseAbiParameters, zeroAddress } from 'viem';
import type { Config } from 'wagmi';
import { CORE_ADDRESS, MULTIPLAYER_GAME } from '@/src/global';
import { CoreABI, HouseMultiplayerGameABI, RouletteSinglePlayerStrategyABI } from '@/src/lib/abi';
import { encodeBet } from '..';
import type { ChipPlaceProps, LocalBet, SpinParams } from '../types';

/** Previously one key for both modes — caused live chips to appear on single-player board and vice versa. */
const LEGACY_BETS_KEY = 'bets';

export function localBetsStorageKey(isSingle: boolean): string {
	return isSingle ? 'betfin:roulette:local-bets:single' : 'betfin:roulette:local-bets:live';
}

function readLocalBetsRaw(isSingle: boolean): LocalBet[] {
	const key = localBetsStorageKey(isSingle);
	const data = localStorage.getItem(key);
	if (data) return JSON.parse(data) as LocalBet[];
	const legacy = localStorage.getItem(LEGACY_BETS_KEY);
	if (legacy) {
		try {
			localStorage.setItem(key, legacy);
			localStorage.removeItem(LEGACY_BETS_KEY);
			return JSON.parse(legacy) as LocalBet[];
		} catch {
			return [];
		}
	}
	return [];
}

function writeLocalBetsRaw(isSingle: boolean, bets: LocalBet[]) {
	localStorage.setItem(localBetsStorageKey(isSingle), JSON.stringify(bets));
}

export const fetchLocalBets = (isSingle: boolean): LocalBet[] => readLocalBetsRaw(isSingle);

export const fetchChipsByPosition = (position: string, isSingle: boolean) => fetchLocalBets(isSingle).filter((bet) => bet.item === position);

export const fetchSelectedChip = async (): Promise<number> => {
	const stored = Number(localStorage.getItem('chip'));
	return Number.isFinite(stored) && stored > 0 ? stored : 10000;
};

export const fetchLimits = async (config: Config, strategyAddress?: Address) => {
	if (!strategyAddress) return [];
	const keys: { key: string; value: bigint; label?: string }[] = [
		{ key: 'STRAIGHT', value: 1n },
		{ key: 'SPLIT', value: 3n },
		{ key: 'ROW', value: BigInt(14) },
		{ key: 'CORNER', value: BigInt(54) },
		{ key: 'COLUMN', value: BigInt(78536544840) },
		{ key: 'DOZEN', value: BigInt(8190) },
		{ key: 'BASIC', value: BigInt(91447186090), label: 'RED/BLACK' },
		{ key: 'BASIC', value: BigInt(45812984490), label: 'ODD/EVEN' },
		{ key: 'BASIC', value: BigInt(524286), label: 'LOW/HIGH' },
	];
	const contracts = keys.flatMap((k) => [
		{ abi: RouletteSinglePlayerStrategyABI, address: strategyAddress, functionName: 'minBets' as const, args: [k.value] },
		{ abi: RouletteSinglePlayerStrategyABI, address: strategyAddress, functionName: 'maxBets' as const, args: [k.value] },
		{ abi: RouletteSinglePlayerStrategyABI, address: strategyAddress, functionName: 'payouts' as const, args: [k.value] },
	]);
	const data = await multicall(config, { contracts });
	return keys.map((k, i) => {
		const min = (data[i * 3].result ?? 0n) as bigint;
		const max = (data[i * 3 + 1].result ?? 0n) as bigint;
		const payout = Number(data[i * 3 + 2].result ?? 0n);
		return { title: k.label || k.key, payout, min, max };
	});
};

export const place = async (params: ChipPlaceProps, chip: number, t: TFunction<'roulette', 'errors'>, isSingle: boolean) => {
	const old = fetchLocalBets(isSingle);
	if (params.numbers.length === 0) {
		writeLocalBetsRaw(isSingle, []);
		return;
	}
	if (chip === 0) {
		throw new Error(t('invalidAmount'));
	}
	const newBet = {
		numbers: params.numbers,
		amount: chip,
		item: params.item,
	} as LocalBet;
	const newBets = [...old, newBet];
	writeLocalBetsRaw(isSingle, newBets);
};

export const unplace = async (params: ChipPlaceProps, isSingle: boolean) => {
	const old = fetchLocalBets(isSingle);
	if (params.numbers.length === 0) {
		writeLocalBetsRaw(isSingle, []);
		return;
	}
	const { item } = params;
	const index = old.findLastIndex((bet) => bet.item === item);

	if (index === -1) {
		return;
	}
	const newBets = [...old.filter((e) => e.item !== item)];
	writeLocalBetsRaw(isSingle, newBets);
};

export const doublePlace = async (isSingle: boolean) => {
	const bets = fetchLocalBets(isSingle);
	const betsMap = [...bets, ...bets].reduce((acc: Record<string, LocalBet[]>, val) => {
		if (acc[val.item]) {
			acc[val.item].push(val);
		} else {
			acc[val.item] = [val];
		}
		return acc;
	}, {});
	const newBets = Object.values(betsMap).reduce((acc, bets) => {
		// biome-ignore lint/performance/noAccumulatingSpread: todo
		return [...acc, ...bets];
	}, []);
	writeLocalBetsRaw(isSingle, newBets);
};

export const clearAllBets = async (isSingle: boolean) => {
	writeLocalBetsRaw(isSingle, []);
};

export const undoPlace = async (isSingle: boolean) => {
	const bets = fetchLocalBets(isSingle);
	bets.pop();
	writeLocalBetsRaw(isSingle, bets);
};

export const submitBet = async (params: SpinParams, config: Config) => {
	const { bets, playerAddress, gameAddress } = params;
	const uniquesBets: Record<string, LocalBet> = {};
	for (const bet of bets) {
		const key = bet.item.toString();
		if (uniquesBets[key]) {
			uniquesBets[key].amount += bet.amount;
		} else {
			uniquesBets[key] = bet;
		}
	}

	const newBets = Object.values(uniquesBets);
	const preparedBets = newBets.flatMap(encodeBet);

	const totalAmount = newBets.reduce((sum, bet) => sum + BigInt(bet.amount) * 10n ** 18n, 0n);

	const isMultiplayer = gameAddress.toLowerCase() === MULTIPLAYER_GAME.toLowerCase();
	// Single-player strategy: abi.decode(data, (SubBet[])). Multiplayer: (uint256 roundId, SubBet[]).
	const data = isMultiplayer
		? encodeAbiParameters(parseAbiParameters(['uint256', '(uint256 amount, uint256 bitmap)[]']), [params.multiplayerRoundId ?? 0n, preparedBets])
		: encodeAbiParameters(parseAbiParameters(['(uint256 amount, uint256 bitmap)[]']), [preparedBets]);

	await simulateContract(config, {
		abi: CoreABI,
		address: CORE_ADDRESS,
		functionName: 'bet',
		args: [playerAddress, playerAddress, gameAddress, totalAmount, data, zeroAddress],
	});
	return writeContract(config, {
		abi: CoreABI,
		address: CORE_ADDRESS,
		functionName: 'bet',
		args: [playerAddress, playerAddress, gameAddress, totalAmount, data, zeroAddress],
	});
};

export const changeChip = async ({ amount }: { amount: number }) => {
	localStorage.setItem('chip', amount.toString());
};
export const fetchDebugMode = (): boolean => {
	const data = localStorage.getItem('roulette-debug');

	if (!data) {
		return false;
	}
	return JSON.parse(data);
};

export const setDebugMode = async (nextDebug: boolean) => {
	localStorage.setItem('roulette-debug', JSON.stringify(nextDebug));
};

export const getRequiredAllowance = (isSingle: boolean): number => {
	const bets = fetchLocalBets(isSingle);
	return bets.reduce((acc: number, val: { amount: number }) => {
		return acc + val.amount;
	}, 0);
};

export const manualSpin = async (config: Config, roundId: bigint) => {
	await simulateContract(config, {
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		functionName: 'spin',
		args: [roundId],
	});
	return writeContract(config, {
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		functionName: 'spin',
		args: [roundId],
	});
};
