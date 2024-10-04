import { FIRST_BLOCK, PARTNER, ROULETTE } from '@/src/global.ts';
import { encodeBet } from '@/src/lib/roulette';
import type { FuncProps, Limit, LocalBet, RouletteBet, RouletteSubBet, SpinParams } from '@/src/lib/roulette/types.ts';
import { PartnerContract, RouletteBetContract, RouletteContract, arrayFrom } from '@betfinio/abi';
import { ZeroAddress } from '@betfinio/abi';
import { multicall, readContract, writeContract } from '@wagmi/core';
import _ from 'lodash';
import { type Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import { getContractEvents } from 'viem/actions';
import type { Config } from 'wagmi';

export const fetchLocalBets = (): LocalBet[] => {
	const data = localStorage.getItem('bets');
	if (!data) {
		return [];
	}
	return JSON.parse(data) as LocalBet[];
};

export const fetchLimits = async (config: Config): Promise<Limit[]> => {
	const keys: { key: string; value: bigint; label?: string }[] = [
		{ key: 'STRAIGHT', value: 1n },
		{ key: 'SPLIT', value: 3n },
		{ key: 'ROW', value: BigInt(14) },
		{ key: 'CORNER', value: BigInt(54) },
		{ key: 'COLUMN', value: BigInt(78536544840) },
		{ key: 'DOZEN', value: BigInt(8190) },
		{ key: 'RED', value: BigInt(91447186090), label: 'RED/BLACK' },
		{ key: 'ODD', value: BigInt(45812984490), label: 'ODD/EVEN' },
		{ key: 'LOW', value: BigInt(524286), label: 'LOW/HIGH' },
	];
	const data = await multicall(config, {
		contracts: keys.map((key) => ({
			abi: RouletteContract.abi,
			address: ROULETTE,
			functionName: 'getBitMapPayout',
			args: [key.value],
		})),
	});
	return data.map((e, i) => {
		const result = e.result as bigint[];
		return { title: keys[i].label || keys[i].key, payout: Number(result[0]), min: result[1], max: result[2] };
	});
};

export async function calculatePotentialWin(bets: LocalBet[], config: Config): Promise<bigint> {
	const preparedBets = bets.flatMap(encodeBet);
	const result = (await readContract(config, {
		abi: RouletteContract.abi,
		address: ROULETTE,
		functionName: 'getPossibleWin',
		args: [preparedBets],
	})) as bigint[];
	return result[0];
}

export const fetchRouletteBets = async (address: Address, config: Config): Promise<RouletteBet[]> => {
	console.log('fetching roulette bets for', address);
	const count = (await readContract(config, {
		abi: RouletteContract.abi,
		address: ROULETTE,
		functionName: 'getPlayerRequestsCount',
		args: [address],
	})) as number;
	const requests = await multicall(config, {
		contracts: arrayFrom(Number(count))
			.slice(-10)
			.map((_, i) => ({
				abi: RouletteContract.abi,
				address: ROULETTE,
				functionName: 'playerRequests',
				args: [address, Number(count) - 1 - i],
			})),
	});
	const betAddresses = await multicall(config, {
		contracts: requests
			.map((e) => e.result)
			.map((r) => ({
				abi: RouletteContract.abi,
				address: ROULETTE,
				functionName: 'requestBets',
				args: [r],
			})),
	});
	return (await Promise.all(betAddresses.map((e) => e.result as Address).map((bet) => populateRouletteBet(bet, config)))).filter((bet) => bet.status !== 1n);
};

export async function populateRouletteBet(bet: Address, config: Config): Promise<RouletteBet> {
	const betData = await multicall(config, {
		contracts: [
			{
				abi: RouletteBetContract.abi,
				address: bet as Address,
				functionName: 'getPlayer',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getResult',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getCreated',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getAmount',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getWinNumber',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getBetsCount',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getRequestId',
			},
			{
				...RouletteBetContract,
				address: bet as Address,
				functionName: 'getStatus',
			},
		],
	});
	const count = Number(betData[5].result as number);
	const subBets = await multicall(config, {
		contracts: arrayFrom(count).map((i) => ({
			...RouletteBetContract,
			address: bet as Address,
			functionName: 'getBet',
			args: [i],
		})),
	});
	return {
		address: bet,
		game: ROULETTE,
		result: betData[1].result as bigint,
		player: betData[0].result as string,
		winNumber: Number(betData[4].result as number),
		amount: betData[3].result as bigint,
		created: betData[2].result as bigint,
		requestId: betData[6].result as bigint,
		status: betData[7].result as bigint,
		bets: subBets.map(
			(e) =>
				({
					amount: (e.result as bigint[])[0],
					bitmap: (e.result as bigint[])[1],
				}) as RouletteSubBet,
		),
	} as RouletteBet;
}

export const fetchSelectedChip = async (): Promise<number> => {
	return Number(localStorage.getItem('chip') || 10000);
};

export const place = async (params: FuncProps, chip: number) => {
	const old = fetchLocalBets();
	if (params.numbers.length === 0 && params.item === 0) {
		localStorage.setItem('bets', JSON.stringify([]));
		return;
	}
	if (chip === 0) {
		throw new Error('Invalid amount');
	}
	const newBet = {
		numbers: params.numbers,
		amount: chip,
		item: params.item,
	} as LocalBet;
	const newBets = [...old, newBet];
	const count = _.countBy(newBets, (e) => e.item)[params.item];
	if (count > 5) {
		throw new Error('You can only place 5 chips');
	}
	localStorage.setItem('bets', JSON.stringify(newBets));
};

export const spin = async (params: SpinParams, config: Config) => {
	const bets = params.bets;
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
	const data = encodeAbiParameters(parseAbiParameters('uint256 count, uint256[] bets'), [BigInt(newBets.length), preparedBets]);
	return await writeContract(config, {
		abi: PartnerContract.abi,
		address: PARTNER,
		functionName: 'placeBet',
		args: [ROULETTE, totalAmount, data],
	});
};

export const unplace = async (params: FuncProps) => {
	const old = fetchLocalBets();
	if (params.numbers.length === 0 && params.item === 0) {
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
	const betsMap = [...bets, ...bets].reduce((acc: Record<number, LocalBet[]>, val) => {
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

export const fetchLastRouletteBets = async (config: Config): Promise<RouletteBet[]> => {
	console.log('fetching last roulette bets ');
	const logs = await getContractEvents(config.getClient(), {
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Landed',
		fromBlock: 0n,
		toBlock: 'latest',
	});
	const betAddresses = logs
		.reverse()
		.slice(0, 10)
		.map((bet) => (bet.args as { bet: Address }).bet);
	return await Promise.all(betAddresses.map((bet) => populateRouletteBet(bet, config)));
};

export const fetchProofTx = async (request: bigint, config: Config): Promise<Address> => {
	const logs = await getContractEvents(config.getClient(), {
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Landed',
		fromBlock: BigInt(FIRST_BLOCK),
		toBlock: 'latest',
		args: {
			requestId: request,
		},
	});
	if (logs.length > 0) {
		return logs[0].transactionHash;
	}
	return ZeroAddress;
};
