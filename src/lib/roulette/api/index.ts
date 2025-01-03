import type { PlayerBet } from '@/src/lib/roulette/types.ts';
import { LiroBetABI } from '@betfinio/abi';
import { readContract } from '@wagmi/core';
import type { Address } from 'viem';
import { parseAbiItem } from 'viem';
import { getLogs } from 'viem/actions';
import type { Config } from 'wagmi';

export const fetchTableBetByBlockHash = async (config: Config, blockHash: Address, tableAddress?: Address) => {
	if (!tableAddress) return;
	const logs = await getLogs(config.getClient(), {
		address: tableAddress,
		event: parseAbiItem('event BetEnded(address indexed bet, uint256 indexed round, uint256 value, uint256 winAmount)'),
		args: {
			round: BigInt(0),
		},
		blockHash: blockHash,
	});

	const betAddress = logs[0].args.bet as Address;
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
	const status = await readContract(config, {
		abi: LiroBetABI,
		address: betAddress,
		functionName: 'getStatus',
		args: [],
	});

	const [, , amount, winAmount, , created] = betInfo;
	return {
		amount,
		bet: betAddress,
		created,
		winNumber: Number(winNumber),
		winAmount,
		status: Number(status),
	} as PlayerBet;
};
