import { LiroBetABI, MultiPlayerTableABI } from '@betfinio/abi';
import { readContract } from '@wagmi/core';
import { type Address, parseAbiItem } from 'viem';
import { getLogs } from 'viem/actions';
import type { Config } from 'wagmi';
import { RoundStatus } from '../../shared/types';
import type { RoundBet, RoundPlayerBet } from '../types';

export const fetchCurrentRoundOfTable = async (config: Config, tableAddress?: Address) => {
	if (!tableAddress) return;
	const round = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: tableAddress,
		functionName: 'getCurrentRound',
	});
	const interval = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: tableAddress,
		functionName: 'interval',
	});

	return {
		round,
		interval,
	};
};

export const fetchCurrentRound = async (config: Config, tableAddress: Address) => {
	const result = await readContract(config, {
		abi: MultiPlayerTableABI,
		address: tableAddress,
		functionName: 'getCurrentRound',
	});
	return result;
};

export const fetchTableBetsByBlockHash = async (config: Config, blockHash: Address, tableAddress?: Address, round?: bigint, playerAddress?: Address) => {
	if (!tableAddress) return;
	const logs = await getLogs(config.getClient(), {
		address: tableAddress,
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
		status: RoundStatus.CREATED,
	};

	let roundPlayerBets: RoundPlayerBet | null = null;

	// Iterate over each log entry
	for (const log of logs) {
		const betAddress = log.args.bet as Address;

		// Fetch bet info
		const betInfo = await readContract(config, {
			abi: LiroBetABI,
			address: betAddress,
			functionName: 'getBetInfo',
			args: [],
		});

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
					status: RoundStatus.CREATED,
				};
			}
		}
	}
	return { roundAllBets, roundPlayerBets };
};
