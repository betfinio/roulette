import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { useVisibleTable } from '../../shared/query';
import {
	fetchBankByRound,
	fetchCurrentRound,
	fetchCurrentRoundOfTable,
	fetchRoundStatus,
	fetchTableBetsByBlockHash,
	fetchTableInterval,
	fetchWinNumber,
} from '../api';
import {
	fetchLiveRouletteTableStats,
	fetchLiveRouletteTables,
	fetchSelectedTableRoundPlayers,
	fetchTableBets,
	fetchTablePlayerRounds,
	fetchTableSelectedRoundBets,
} from '../gql';
import { type RouletteTable, type WheelState, WheelStatus } from '../types';

export const useLiveRouletteState = () => {
	const { table } = useVisibleTable();
	const { roundStatus, round } = useGetSelectedRound();
	const queryClient = useQueryClient();
	const state = useQuery<WheelState>({
		queryKey: ['live-roulette', 'state', round, table],
		initialData: { state: WheelStatus.Loading },
	});

	useEffect(() => {
		if (state.data.state === WheelStatus.Loading && roundStatus !== undefined) {
			queryClient.setQueryData(['live-roulette', 'state', round, table], { state: roundStatus });
			queryClient.refetchQueries({ queryKey: ['live-roulette', 'state', round, table] });
		}
	}, [roundStatus]);

	const updateState = (st: WheelState) => {
		queryClient.setQueryData(['live-roulette', 'state', round, table], { ...state.data, ...st });
		queryClient.refetchQueries({ queryKey: ['liveroulette', 'state', round, table] });
	};

	return { state, updateState };
};
export const useTablePlayerRounds = (table?: Address) => {
	const { address = ZeroAddress } = useAccount();

	const queryKey = ['roulette', 'bets', 'player', address, table];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTablePlayerRounds(address, table),
			refetchOnWindowFocus: false,
			enabled: !!table,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useTableRounds = (last: number, table?: Address) => {
	const queryKey = ['roulette', 'bets', 'table', 'rounds', table, last];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTableBets(last, table),
			refetchOnWindowFocus: false,
			enabled: !!table,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetCurrentRound = (table?: Address) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'currentRound', table],
		queryFn: () => fetchCurrentRoundOfTable(config, table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};

export const useCurrentInterval = (table: Address) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', table, 'currentInterval'],
		queryFn: () => fetchTableInterval(config, table),
	});
};

export const useCurrentRound = (table: Address) => {
	const { data: interval = 0 } = useCurrentInterval(table);
	return useQuery({
		queryKey: ['roulette', table, 'currentRound'],
		queryFn: () => fetchCurrentRound(interval),
		refetchInterval: 300,
	});
};

export const useGetSelectedRound = () => {
	const search = useSearch({ strict: false });
	const { table } = useVisibleTable();
	const { data: currentRound, ...currentRoundProps } = useGetCurrentRound(table);

	const round = search?.round ? Number(search.round) : undefined;

	const isRoundFinished = Number(currentRound?.round) > Number(round);
	const { data: currentRoundBank, ...bankByRoundProps } = useGetBankByRound(table, round);
	const { data: status, ...roundStatusProps } = useGetRoundStatus(table, round);
	const { data: winNumber = 42n, ...winNumberProps } = useGetWinNumber(table, round);

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
	const { table } = useVisibleTable();
	return useMutation({
		mutationKey: ['roulette', 'bets', 'blockHash'],
		mutationFn: ({ blockHash, round }: { blockHash: Address; round: bigint }) => fetchTableBetsByBlockHash(config, blockHash, table, round, address),
	});
};

export const useGetTableRoundPlayers = (table?: Address, round?: number) => {
	const queryKey = ['roulette', 'table', 'round', 'players', table, round];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchSelectedTableRoundPlayers(table, round),
			refetchOnWindowFocus: false,
			enabled: !!table && !!round,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetTableSelectedRoundBets = (table?: Address, round?: number) => {
	const queryKey = ['roulette', 'table', 'bets', table, round];
	return useQuery({
		queryKey,
		queryFn: () => fetchTableSelectedRoundBets(table, round),
		refetchOnWindowFocus: false,
		enabled: !!table && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetBankByRound = (table?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'bank', table, Number(round)],
		queryFn: () => fetchBankByRound(config, table, round),
		refetchOnWindowFocus: false,
		enabled: !!table && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetRoundStatus = (table?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'round', 'status', table, Number(round)],
		queryFn: () => fetchRoundStatus(config, table, round),
		refetchOnWindowFocus: false,
		enabled: !!table && !!round,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetWinNumber = (table?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'round', 'winNumber', table, Number(round)],
		queryFn: () => fetchWinNumber(config, table, round),
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

export const useLiveRouletteTableStats = (table?: Address) => {
	const queryKey = ['roulette', 'table', 'stat', table];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchLiveRouletteTableStats(table),
			refetchOnWindowFocus: false,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};
