import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { useGetTableAddress } from '../../shared/query';
import { fetchCurrentRoundOfTable, fetchTableBetsByBlockHash } from '../api';
import { fetchSelectedTableRoundPlayers, fetchTableBets, fetchTablePlayerRounds, fetchTableSelectedRoundBets } from '../gql';

export const useGetTablePlayerRounds = (tableAddress?: Address) => {
	const { address = ZeroAddress } = useAccount();
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', address, tableAddress],
		queryFn: () => fetchTablePlayerRounds(address, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
	});
};

export const useGetTableRounds = (last: number, tableAddress?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'table', 'rounds', tableAddress, last],
		queryFn: () => fetchTableBets(last, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
	});
};

export const useGetCurrentRound = (tableAddress?: Address) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['roulette', 'currentRound', tableAddress],
		queryFn: () => fetchCurrentRoundOfTable(config, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
	});
};

export const useMutateCurrentRound = () => {
	const config = useConfig();
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['roulette', 'currentRound'],
		mutationFn: (tableAddress: Address) => fetchCurrentRoundOfTable(config, tableAddress),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roulette', 'currentRound'] });
		},
	});
};

export const useGetSelectedRound = () => {
	const search = useSearch({ strict: false });
	const { tableAddress } = useGetTableAddress();
	const { data: currentRound } = useGetCurrentRound(tableAddress);

	const round = search?.round ? Number(search.round) : undefined;
	const isRoundFinished = Number(currentRound?.round) > Number(round);

	return { round, isRoundFinished };
};

export const useFetchTableBetsByBlockHash = () => {
	const config = useConfig();
	const { address = ZeroAddress } = useAccount();

	const { tableAddress } = useGetTableAddress();
	return useMutation({
		mutationKey: ['roulette', 'bets', 'blockHash'],
		mutationFn: ({ blockHash, round }: { blockHash: Address; round: bigint }) => fetchTableBetsByBlockHash(config, blockHash, tableAddress, round, address),
	});
};

export const useGetTableRoundPlayers = (tableAddress?: Address, round?: number) => {
	return useQuery({
		queryKey: ['roulette', 'table', 'round', 'players', tableAddress, round],
		queryFn: () => fetchSelectedTableRoundPlayers(tableAddress, round),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress && !!round,
	});
};

export const useGetTableSelectedRoundBets = (tableAddress?: Address, round?: number) => {
	return useQuery({
		queryKey: ['roulette', 'table', 'bets', tableAddress, round],
		queryFn: () => fetchTableSelectedRoundBets(tableAddress, round),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress && !!round,
	});
};
