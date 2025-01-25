import { PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { LiroBetABI, LiveRouletteABI, MultiPlayerTableABI, ZeroAddress } from '@betfinio/abi';
import { readContract } from '@wagmi/core';
import { getBlockByTimestamp } from 'betfinio_context/lib/gql';
import { type Address, parseAbiItem } from 'viem';
import { getBlockNumber, getContractEvents, getLogs } from 'viem/actions';
import type { Config } from 'wagmi';
import { fetchBetInfo } from '../../shared/api';
import { RoundStatus } from '../../shared/types';
import { fetchSelectedTableRoundWinNumer } from '../gql';
import type { RoundBet, RoundPlayerBet, WheelStatus } from '../types';

export const fetchCurrentRound = async (interval: number) => {
	if (interval === 0) return 0;
	return Math.floor(Date.now() / 1000 / interval);
};

export const fetchCurrentRoundOfTable = async (config: Config, table?: Address) => {
	if (!table) return;

	const interval = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: table,
		functionName: 'interval',
	});

	// Calculate the current round based on the current timestamp
	const now = Math.floor(Date.now() / 1000); // Current time in seconds
	const round = BigInt(Math.floor(now / Number(interval ?? 1n))); // Calculate the current round

	const roundBank = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: table,
		functionName: 'getRoundBank',
		args: [round],
	});

	return {
		round,
		interval,
		roundHasBets: roundBank > 0n,
	};
};

export const fetchTableBetsByBlockHash = async (config: Config, blockHash: Address, table?: Address, round?: bigint, playerAddress?: Address) => {
	if (!table) return;
	const logs = await getLogs(config.getClient(), {
		address: table,
		event: parseAbiItem('event BetEnded(address indexed bet, uint256 indexed round, uint256 value, uint256 winAmount)'),
		args: {
			round: round,
		},
		blockHash: blockHash,
	});

	const roundAllBets: RoundBet = {
		amount: BigInt(0),
		winAmount: BigInt(0),
		created: BigInt(0),
		round: Number(round),
		winNumber: -1,
		status: RoundStatus.FINISHED,
	};

	let roundPlayerBets: RoundPlayerBet | null = null;

	// Iterate over each log entry
	for (const log of logs) {
		const betAddress = log.args.bet as Address;

		// Fetch bet info
		const betInfo = await fetchBetInfo(config, betAddress);

		const winNumber = await readContract(config, {
			abi: LiroBetABI,
			address: betAddress,
			functionName: 'winNumber',
			args: [],
		});

		// Extract values from bet info
		const [player, , amount, winAmount, , created] = betInfo;

		// Update totals
		roundAllBets.amount += amount;
		roundAllBets.winAmount += winAmount;
		roundAllBets.created = created;
		roundAllBets.winNumber = Number(winNumber);
		if (player === playerAddress) {
			if (roundPlayerBets) {
				roundPlayerBets.amount += amount;
				roundPlayerBets.winAmount += winAmount;
				roundPlayerBets.created = created;
				roundPlayerBets.winNumber = Number(winNumber);
			} else {
				roundPlayerBets = {
					amount,
					round: Number(round),
					created,
					winNumber: Number(winNumber),
					winAmount,
					player,
					status: RoundStatus.FINISHED,
				};
			}
		}
	}
	return { roundAllBets, roundPlayerBets };
};

export const fetchBankByRound = async (config: Config, table?: Address, round?: number) => {
	if (!table || !round) return;
	const roundBank = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: table,
		functionName: 'getRoundBank',
		args: [BigInt(round)],
	});

	return Number(roundBank);
};

export const fetchRoundStatus = async (config: Config, table?: Address, round?: number) => {
	if (!table || !round) return;
	const roundStatus = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: table,
		functionName: 'roundStatus',
		args: [BigInt(round)],
	});

	return Number(roundStatus) as WheelStatus;
};

export const fetchWinNumber = async (config: Config, tableAddress?: Address, round?: number) => {
	if (!tableAddress || !round) return 42n;

	const interval = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: tableAddress,
		functionName: 'interval',
	});
	const startTime = Number(interval * BigInt(round));
	const startBlock = await getBlockByTimestamp(startTime);
	const endBlock = startBlock + 9999n;

	const currentBlock = await getBlockNumber(config.getClient());
	if (currentBlock >= endBlock) {
		const winNumber = await fetchSelectedTableRoundWinNumer(tableAddress, round);
		return winNumber ?? 42n;
	}

	const randomGeneratedData = await getContractEvents(config.getClient(), {
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		args: {
			table: tableAddress,
			round: BigInt(round),
			player: ZeroAddress,
		},
		fromBlock: startBlock,
		toBlock: endBlock,
	});

	if (randomGeneratedData.length === 0) {
		return 42n;
	}
	return randomGeneratedData?.[0]?.args.value || 42n;
};

export const fetchTableInterval = async (config: Config, table?: Address) => {
	if (!table || table === ZeroAddress) return 0;
	const interval = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: table,
		functionName: 'interval',
	});
	return Number(interval);
};
