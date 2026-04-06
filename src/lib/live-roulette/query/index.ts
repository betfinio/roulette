import { ZeroAddress } from '@betfinio/abi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { MULTIPLAYER_INTERVAL } from '@/src/global';
import { useVisibleRound, useVisibleTable } from '../../shared/query';
import { fetchCurrentRound, fetchCurrentRoundOfTable, fetchMultiplayerRoundWheelStatusFromChain, fetchMultiplayerVrfWinNumberFromLogs } from '../api';
import {
	fetchLiveRouletteTableStats,
	fetchLiveRouletteTables,
	fetchRoundBank,
	fetchRoundStatus,
	fetchSelectedTableRoundPlayers,
	fetchSelectedTableRoundWinNumer,
	fetchTableBets,
	fetchTablePlayerRounds,
	fetchTableSelectedRoundBets,
} from '../gql';
import { type RouletteTable, type WheelState, WheelStatus } from '../types';

function isLiveTableAddress(table?: Address): table is Address {
	return Boolean(table && table !== ZeroAddress);
}

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

	const updateRoundState = (round: number, st: WheelState) => {
		queryClient.setQueryData(['live-roulette', 'state', round, table], { ...state.data, ...st });
		queryClient.refetchQueries({ queryKey: ['liveroulette', 'state', round, table] });
	};

	return { state, updateState, updateRoundState };
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
			enabled: isLiveTableAddress(table),
			staleTime: 60_000,
		}),
	};
};

export const useTableRounds = (table?: Address) => {
	const queryKey = ['roulette', 'bets', 'table', 'rounds', table];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTableBets(table),
			refetchOnWindowFocus: false,
			enabled: isLiveTableAddress(table),
			staleTime: 60_000,
		}),
	};
};

export const useGetCurrentRound = (table?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'currentRound', table],
		queryFn: () => fetchCurrentRoundOfTable(null as never, table),
		refetchOnWindowFocus: false,
		enabled: isLiveTableAddress(table),
	});
};

/**
 * Returns the multiplayer round interval from env — no contract call needed.
 */
export const useCurrentInterval = (_table: Address) => {
	return useQuery({
		queryKey: ['roulette', 'currentInterval'],
		queryFn: () => MULTIPLAYER_INTERVAL,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useCurrentRound = (_table: Address) => {
	return useQuery<number>({
		queryKey: ['roulette', 'currentRound'],
		queryFn: () => fetchCurrentRound(MULTIPLAYER_INTERVAL),
		refetchInterval: (query) => {
			if (fetchCurrentRound(MULTIPLAYER_INTERVAL) === query.state.data) return false;
			return 300;
		},
	});
};

export const useGetSelectedRound = () => {
	const { table } = useVisibleTable();
	const { round } = useVisibleRound();
	const { data: currentRound, ...currentRoundProps } = useCurrentRound(table);

	const isRoundFinished = Number(currentRound) > Number(round);
	const { data: currentRoundBank, ...bankByRoundProps } = useGetBankByRound(table, round);
	const { data: status, ...roundStatusProps } = useGetRoundStatus(table, round);
	const { data: winNumber = 42n, ...winNumberProps } = useGetWinNumber(table, round);

	return {
		round,
		isRoundFinished,
		roundHasBets: (currentRoundBank ?? 0n) > 0n,
		roundStatus: status,
		winNumber,
		winNumberProps,
		roundStatusProps,
		bankByRoundProps,
		currentRoundProps,
		currentRoundBank,
	};
};

export const useGetTableRoundPlayers = (table?: Address, round?: number) => {
	const queryKey = ['roulette', 'table', 'round', 'players', table, round];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchSelectedTableRoundPlayers(table, round),
			refetchOnWindowFocus: false,
			enabled: isLiveTableAddress(table) && round !== undefined,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetTableSelectedRoundBets = (table?: Address, round?: number) => {
	const queryKey = ['roulette', 'table', 'bets', table, round];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchTableSelectedRoundBets(table, round),
			refetchOnWindowFocus: false,
			enabled: isLiveTableAddress(table) && round !== undefined,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};

export const useGetBankByRound = (table?: Address, round?: number) => {
	return useQuery({
		queryKey: ['roulette', 'bank', table, Number(round)],
		queryFn: () => fetchRoundBank(table, round),
		refetchOnWindowFocus: false,
		enabled: isLiveTableAddress(table) && round !== undefined,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetRoundStatus = (table?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'round', 'status', table, Number(round)],
		queryFn: async () => {
			const fromGraph = await fetchRoundStatus(table, round);
			if (!table || round === undefined) return fromGraph;
			const fromChain = await fetchMultiplayerRoundWheelStatusFromChain(config, table, round);
			if (fromChain === null) return fromGraph;
			if (fromChain.chainRoundStatus === 3) return WheelStatus.ResultReadyAwaitingSettlement;
			if (fromGraph === WheelStatus.Requested && fromChain.wheelStatus !== WheelStatus.Requested) return fromChain.wheelStatus;
			return fromGraph;
		},
		refetchOnWindowFocus: false,
		enabled: isLiveTableAddress(table) && round !== undefined,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useGetWinNumber = (table?: Address, round?: number) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'round', 'winNumber', table, Number(round)],
		queryFn: async () => {
			const fromGraph = await fetchSelectedTableRoundWinNumer(table, round);
			if (!table || round === undefined) return fromGraph;
			if (fromGraph !== 42n) return fromGraph;
			const chain = await fetchMultiplayerRoundWheelStatusFromChain(config, table, round);
			if (chain?.chainRoundStatus !== 3) return fromGraph;
			const fromLogs = await fetchMultiplayerVrfWinNumberFromLogs(config, table, round);
			if (fromLogs === null) return fromGraph;
			return BigInt(fromLogs);
		},
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
		enabled: isLiveTableAddress(table) && round !== undefined,
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
			enabled: isLiveTableAddress(table),
		}),
	};
};
