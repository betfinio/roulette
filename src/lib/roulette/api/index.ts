import { PARTNER, PUBLIC_LIRO_ADDRESS } from '@/src/global.ts';
import { encodeBet } from '@/src/lib/roulette';
import type { ChiPlaceProps, LocalBet, SpinParams } from '@/src/lib/roulette/types.ts';
import { LiveRouletteABI, MultiPlayerTableABI, PartnerABI, SinglePlayerTableABI } from '@betfinio/abi';
import { multicall, readContract, simulateContract, writeContract } from '@wagmi/core';
import type { TFunction } from 'i18next';
import _ from 'lodash';
import type { Address } from 'viem';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import type { Config } from 'wagmi';

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

export const fetchLimits = async (config: Config, tableAddress?: Address) => {
	if (!tableAddress) return [];
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
			address: tableAddress,
			functionName: 'limits',
			args: [key.key],
		})),
	});

	return data.map((e, i) => {
		const result = e.result as unknown as [bigint, bigint, bigint];
		return { title: keys[i].label || keys[i].key, payout: Number(result[2]), min: result[0], max: result[1] };
	});
};

export async function calculatePotentialWin(bets: LocalBet[], config: Config): Promise<bigint> {
	const preparedBets = bets.map(encodeBet);
	const result = await readContract(config, {
		abi: SinglePlayerTableABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'getPossibleWin',
		args: [preparedBets],
	});
	return result[0];
}

export const fetchSelectedChip = async (): Promise<number> => {
	return Number(localStorage.getItem('chip') || 10000);
};

export const place = async (params: ChiPlaceProps, chip: number, t: TFunction<'roulette', 'errors'>) => {
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
	const count = _.countBy(newBets, (e) => e.item)[params.item];
	if (count > 5) {
		throw new Error(t('only5Chips'));
	}
	localStorage.setItem('bets', JSON.stringify(newBets));
};

export const submitBet = async (params: SpinParams, config: Config) => {
	const { bets, playerAddress, roundNumber, tableAddress } = params;
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
		tableAddress,
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

export const unplace = async (params: ChiPlaceProps) => {
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
	old.splice(index, 1);
	const newBets = [...old];
	localStorage.setItem('bets', JSON.stringify(newBets));
};

export const getRequiredAllowance = (): number => {
	const bets = JSON.parse(localStorage.getItem('bets') || '[]');
	return bets.reduce((acc: number, val: { amount: number }) => {
		return acc + val.amount;
	}, 0);
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
		return [...acc, ...bets.slice(0, 5)];
	}, []);
	localStorage.setItem('bets', JSON.stringify(newBets));
};

export const undoPlace = async () => {
	const bets = fetchLocalBets();
	bets.pop();
	localStorage.setItem('bets', JSON.stringify(bets));
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

export const clearAllBets = async () => {
	localStorage.setItem('bets', JSON.stringify([]));
};

export const fetchSinglePlayerAddress = async (config: Config) => {
	const result = await readContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'singlePlayerTable',
	});
	return result;
};

export const fetchTableByAddress = async (config: Config, address: Address) => {
	const result = await readContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'tables',
		args: [address],
	});
	return result;
};

export const fetchCurrentRoundOfTable = async (config: Config, tableAddress: Address) => {
	const result = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: tableAddress,
		functionName: 'getCurrentRound',
	});
	return result;
};

export const testSpin = async (config: Config, tableAddress: Address, round: bigint) => {
	const simulate = await simulateContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'spin',
		args: [tableAddress, round],
	}).catch((e) => {
		console.log('error', e);
	});
	const result = await writeContract(config, {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		functionName: 'spin',
		args: [tableAddress, round],
	});

	console.log(result, 'result');
};
