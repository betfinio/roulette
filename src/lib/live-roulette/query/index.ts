import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { useGetTableAddress } from '../../shared/query';
import { fetchBankByRound, fetchCurrentRoundOfTable, fetchRoundStatus, fetchTableBetsByBlockHash, fetchWinNumber } from '../api';
import { fetchLiveRouletteTables, fetchSelectedTableRoundPlayers, fetchTableBets, fetchTablePlayerRounds, fetchTableSelectedRoundBets } from '../gql';
import { type RouletteTable, type WheelState, WheelStatus } from '../types';

export const useLiveRouletteState = () => {
	const { tableAddress } = useGetTableAddress();
	const { roundStatus, round } = useGetSelectedRound();
	const queryClient = useQueryClient();
	const state = useQuery<WheelState>({
		queryKey: ['liveroulette', 'state', round, tableAddress],
		initialData: { state: WheelStatus.Loading },
	});

	useEffect(() => {
		if (state.data.state === WheelStatus.Loading && roundStatus !== undefined) {
			queryClient.setQueryData(['liveroulette', 'state', round, tableAddress], { state: roundStatus });
			queryClient.refetchQueries({ queryKey: ['liveroulette', 'state', round, tableAddress] });
		}
	}, [roundStatus]);

	const updateState = (st: WheelState) => {
		queryClient.setQueryData(['liveroulette', 'state', round, tableAddress], { ...state.data, ...st });
		queryClient.refetchQueries({ queryKey: ['liveroulette', 'state', round, tableAddress] });
	};

	return { state, updateState };
};
export const useGetTablePlayerRounds = (tableAddress?: Address) => {
	const { address = ZeroAddress } = useAccount();

	const queryKey = ['roulette', 'bets', 'player', address, tableAddress];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTablePlayerRounds(address, tableAddress),
			refetchOnWindowFocus: false,
			enabled: !!tableAddress,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetTableRounds = (last: number, tableAddress?: Address) => {
	const queryKey = ['roulette', 'bets', 'table', 'rounds', tableAddress, last];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTableBets(last, tableAddress),
			refetchOnWindowFocus: false,
			enabled: !!tableAddress,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetCurrentRound = (tableAddress?: Address) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['roulette', 'currentRound', tableAddress],
		queryFn: () => fetchCurrentRoundOfTable(config, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,

		//staleTime:Number.POSITIVE_INFINITY
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
	const { data: currentRound, ...currentRoundProps } = useGetCurrentRound(tableAddress);

	const round = search?.round ? Number(search.round) : undefined;
	const isRoundFinished = Number(currentRound?.round) > Number(round);
	const { data: currentRoundBank, ...bankByRoundProps } = useGetBankByRound(tableAddress, round);
	const { data: status, ...roundStatusProps } = useGetRoundStatus(tableAddress, round);
	const { data: winNumber = 42n, ...winNumberProps } = useGetWinNumber(tableAddress, round);

	return {
		round,
		isRoundFinished,
		roundHasBets: (currentRoundBank ?? 0) > 0,
		roundStatus: status,
		winNumber,
		winNumberProps,
		roundStatusProps,
		bankByRoundProps,
		currentRoundProps,
	};
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
	const queryKey = ['roulette', 'table', 'round', 'players', tableAddress, round];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchSelectedTableRoundPlayers(tableAddress, round),
			refetchOnWindowFocus: false,
			enabled: !!tableAddress && !!round,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetTableSelectedRoundBets = (tableAddress?: Address, round?: number) => {
	const queryKey = ['roulette', 'table', 'bets', tableAddress, round];
	return useQuery({
		queryKey,
		queryFn: () => fetchTableSelectedRoundBets(tableAddress, round),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetBankByRound = (tableAddress?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'bank', tableAddress, Number(round)],
		queryFn: () => fetchBankByRound(config, tableAddress, round),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetRoundStatus = (tableAddress?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'round', 'status', tableAddress, Number(round)],
		queryFn: () => fetchRoundStatus(config, tableAddress, round),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetWinNumber = (tableAddress?: Address, round?: number) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['roulette', 'round', 'winNumber', tableAddress, Number(round)],
		queryFn: () => fetchWinNumber(config, tableAddress, round),
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetLiveRouletteTables = () => {
	return useQuery<RouletteTable[]>({
		queryKey: ['roulette', 'tables'],
		queryFn: fetchLiveRouletteTables,
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	});
};
