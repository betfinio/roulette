import { PARTNER, PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { LiroBetABI, LiveRouletteABI, PartnerABI, SinglePlayerTableABI } from '@betfinio/abi';
import { multicall, readContract, simulateContract, writeContract } from '@wagmi/core';
import type { TFunction } from 'i18next';
import { type Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import type { Config } from 'wagmi';
import { decodeBet, encodeBet } from '..';
import type { ChipPlaceProps, LocalBet, SpinParams } from '../types';

export const fetchLocalBets = (): LocalBet[] => {
	const data = localStorage.getItem('bets');

	if (!data) {
		return [];
	}
	return JSON.parse(data) as LocalBet[];
};
export const fetchChipsByPosition = (position: string) => {
	const bets = fetchLocalBets();

	return bets.filter((bet) => bet.item === position);
};
export const fetchSelectedChip = async (): Promise<number> => {
	return Number(localStorage.getItem('chip') || 10000);
};

export const fetchLimits = async (config: Config, table?: Address) => {
	if (!table) return [];
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
	const data = await multicall(config, {
		contracts: keys.map((key) => ({
			abi: SinglePlayerTableABI,
			address: table,
			functionName: 'limits',
			args: [key.key],
		})),
	});

	return data.map((e, i) => {
		const result = e.result as unknown as [bigint, bigint, bigint];
		return { title: keys[i].label || keys[i].key, payout: Number(result[2]), min: result[0], max: result[1] };
	});
};

export const place = async (params: ChipPlaceProps, chip: number, t: TFunction<'roulette', 'errors'>) => {
	const old = fetchLocalBets();
	if (params.numbers.length === 0) {
		localStorage.setItem('bets', JSON.stringify([]));
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
	localStorage.setItem('bets', JSON.stringify(newBets));
};

export const unplace = async (params: ChipPlaceProps) => {
	const old = fetchLocalBets();
	if (params.numbers.length === 0) {
		localStorage.setItem('bets', JSON.stringify([]));
		return;
	}
	const { item } = params;
	const index = old.findLastIndex((bet) => bet.item === item);

	if (index === -1) {
		return;
	}
	const newBets = [...old.filter((e) => e.item !== item)];
	localStorage.setItem('bets', JSON.stringify(newBets));
};
export const doublePlace = async () => {
	const bets = fetchLocalBets();
	const betsMap = [...bets, ...bets].reduce((acc: Record<string, LocalBet[]>, val) => {
		if (acc[val.item]) {
			acc[val.item].push(val);
		} else {
			acc[val.item] = [val];
		}
		return acc;
	}, {});
	const newBets = Object.values(betsMap).reduce((acc, bets) => {
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		return [...acc, ...bets];
	}, []);
	localStorage.setItem('bets', JSON.stringify(newBets));
};
export const clearAllBets = async () => {
	localStorage.setItem('bets', JSON.stringify([]));
};

export const undoPlace = async () => {
	const bets = fetchLocalBets();
	bets.pop();
	localStorage.setItem('bets', JSON.stringify(bets));
};

export const submitBet = async (params: SpinParams, config: Config) => {
	const { bets, playerAddress, roundNumber, table } = params;
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
	const data = encodeAbiParameters(parseAbiParameters(['struct Bet {uint256 amount; uint256 bitmap;}', 'Bet[] bets, address, uint256, address']), [
		preparedBets, // Array of bets, matching Library.Bet[]
		table,
		roundNumber,
		playerAddress,
	]);
	await simulateContract(config, {
		abi: PartnerABI,
		address: PARTNER,
		functionName: 'placeBet',
		args: [PUBLIC_LIRO_ADDRESS, totalAmount, data],
	});
	return await writeContract(config, {
		abi: PartnerABI,
		address: PARTNER,
		functionName: 'placeBet',
		args: [PUBLIC_LIRO_ADDRESS, totalAmount, data],
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

export const getRequiredAllowance = (): number => {
	const bets = JSON.parse(localStorage.getItem('bets') || '[]');
	return bets.reduce((acc: number, val: { amount: number }) => {
		return acc + val.amount;
	}, 0);
};

export const fetchTableByAddress = async (config: Config, address: Address) => {
	return await readContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'tables',
		args: [address],
	});
};

export const manualSpin = async (config: Config, table: Address, round: bigint) => {
	await simulateContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'spin',
		args: [table, round],
	}).catch((e) => {
		console.log('error', e);
	});
	return writeContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'spin',
		args: [table, round],
	});
};

export const fetchBetsBitMapAndAmount = async (config: Config, betAddress: Address) => {
	const result = await readContract(config, {
		abi: LiroBetABI,
		address: betAddress,
		functionName: 'getBets',
	});

	return result[0].map((res, index) => ({ amount: res, bitmap: result[1][index] })).map(decodeBet);
};

export const fetchSinglePlayerAddress = async (config: Config): Promise<Address> => {
	const table = await readContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'singlePlayerTable',
	});
	return table.toLowerCase() as Address;
};

export const fetchBetInfo = async (config: Config, betAddress: Address) => {
	return readContract(config, {
		abi: LiroBetABI,
		address: betAddress,
		functionName: 'getBetInfo',
		args: [],
	});
};
