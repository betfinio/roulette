import { ZeroAddress } from '@betfinio/abi';
import { toast } from '@betfinio/components/ui';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useMatches, useParams, useSearch } from '@tanstack/react-router';
import { getTransactionLink, handleError } from 'betfinio_context/lib/helpers';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType, WriteContractReturnType } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useConfig } from 'wagmi';
import { BET_STATUS_HEADER } from '@/src/components/shared/BetStatusHeader/BetStatusHeader';
import { MULTIPLAYER_GAME, SINGLE_PLAYER_GAME, SINGLE_PLAYER_STRATEGY } from '@/src/global';
import { fetchBetsBitMapAndAmountByRound } from '@/src/lib/shared/gql';
import {
	changeChip,
	clearAllBets,
	doublePlace,
	fetchChipsByPosition,
	fetchDebugMode,
	fetchLimits,
	fetchLocalBets,
	fetchSelectedChip,
	manualSpin,
	place,
	submitBet,
	undoPlace,
	unplace,
} from '../api';
import type { ChipPlaceProps, SpinParams } from '../types';

export const closePaytable = (queryClient: QueryClient) => {
	queryClient.setQueryData(['roulette', 'paytable'], false);
};

export const openPaytable = (queryClient: QueryClient) => {
	queryClient.setQueryData(['roulette', 'paytable'], true);
};
export const usePaytable = () => {
	const queryClient = useQueryClient();
	const { data: isOpen } = useQuery({
		queryKey: ['roulette', 'paytable'],
		initialData: false,
		refetchOnWindowFocus: false,
	});

	return { isOpen, closePaytable: () => closePaytable(queryClient), openPaytable: () => openPaytable(queryClient) };
};

export const useLocalBets = () => {
	const { isSingle } = useVisibleTable();
	return useQuery({
		queryKey: ['roulette', 'local', 'bets', 'all', isSingle],
		queryFn: () => fetchLocalBets(isSingle),
		refetchOnWindowFocus: false,
	});
};

export const useLimits = (_table?: Address) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'limits'],
		queryFn: () => fetchLimits(config, SINGLE_PLAYER_STRATEGY),
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY,
	});
};

export const useSelectedChip = () =>
	useQuery({
		queryKey: ['roulette', 'chip'],
		queryFn: fetchSelectedChip,
		refetchOnWindowFocus: false,
	});

export const usePlace = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation('roulette', { keyPrefix: 'errors' });
	const { data: chip = 0 } = useSelectedChip();
	const { isSingle } = useVisibleTable();
	return useMutation<void, Error, ChipPlaceProps>({
		mutationKey: ['roulette', 'place'],
		mutationFn: (e) => place(e, chip, t, isSingle),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
		onError: (e) => toast.error(e.message),
	});
};
export const useUnplace = () => {
	const queryClient = useQueryClient();
	const { isSingle } = useVisibleTable();
	return useMutation<void, Error, ChipPlaceProps>({
		mutationKey: ['roulette', 'unplace'],
		mutationFn: (e) => unplace(e, isSingle),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
		onError: (e) => toast.error(e.message),
	});
};
export const useDoublePlace = () => {
	const queryClient = useQueryClient();
	const { isSingle } = useVisibleTable();

	return useMutation({
		mutationKey: ['roulette', 'doublePlace'],
		mutationFn: () => doublePlace(isSingle),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
	});
};

export const useUndoPlace = () => {
	const queryClient = useQueryClient();
	const { isSingle } = useVisibleTable();

	return useMutation({
		mutationKey: ['roulette', 'undoPlace'],
		mutationFn: () => undoPlace(isSingle),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
	});
};
export const useChangeChip = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, { amount: number }>({
		mutationKey: ['roulette', 'chip'],
		mutationFn: changeChip,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'chip'] }),
	});
};
export const useLocalChipsForPosition = (position: string) => {
	const { isSingle } = useVisibleTable();
	return useQuery({
		queryKey: ['roulette', 'local', 'bets', position, isSingle],
		queryFn: () => fetchChipsByPosition(position, isSingle),
		refetchOnWindowFocus: false,
	});
};
export const useGetDebugMode = () => {
	return useQuery<boolean>({
		queryKey: ['roulette', 'local', 'debug'],
		queryFn: fetchDebugMode,
		refetchOnWindowFocus: false,
	});
};

export const useClearAllBets = () => {
	const queryClient = useQueryClient();
	const { isSingle } = useVisibleTable();
	return useMutation({
		mutationKey: ['roulette', 'clear', 'bets'],
		mutationFn: () => clearAllBets(isSingle),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
	});
};

export const useRouletteNumbersState = () => {
	const queryClient = useQueryClient();
	const state = useQuery<{ hovered: number[]; selected: number[] }>({
		queryKey: ['roulette', 'numbers'],
		initialData: { hovered: [], selected: [] },
		refetchOnWindowFocus: false,
	});

	const { data: bets = [] } = useLocalBets();

	const selected = bets.flatMap((e) => e.numbers);

	const updateState = (props: { hovered?: number[]; selected?: number[] }) => {
		queryClient.setQueryData(['roulette', 'numbers'], { ...state.data, ...props });
		//	queryClient.invalidateQueries({ queryKey: ['roulette', 'numbers'] });
	};

	const isNumberHovered = (number: number) => {
		// if (hasOtherState) return false;
		return state.data.hovered.includes(number);
	};
	const isNumberSelected = (number: number) => selected.includes(number);
	const onHoverNumbers = (numbers: number[]) => {
		updateState({ hovered: numbers });
	};
	const onLeaveHover = () => {
		updateState({ hovered: [] });
	};

	return { state, updateState, isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover };
};

export const useSubmitBet = () => {
	const { t: tErrors } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t: tLocalErrors } = useTranslation('roulette', { keyPrefix: 'errors' });
	const { t } = useTranslation('roulette');
	const config = useConfig();
	const queryClient = useQueryClient();

	return useMutation<WriteContractReturnType, WriteContractErrorType, SpinParams>({
		mutationKey: ['roulette', 'spin'],
		mutationFn: (params) => submitBet(params, config),
		onError: (e) => {
			// @ts-expect-error todo
			if (e.cause.reason === 'LT02' || e.cause.reason === 'LT03') {
				openPaytable(queryClient);
			}
			toast.error(handleError<'roulette', 'shared'>(e, tLocalErrors, tErrors));
		},
		onSuccess: async (data) => {
			const promise = async () => {
				const receipt = await waitForTransactionReceipt(config.getClient(), { hash: data });
				if (receipt.status !== 'success') {
					throw new Error('Transaction failed');
				}
			};
			toast.promise(promise, {
				loading: t('placingBet'),
				success: t('transactionIsConfirmed'),
				error: t('betWasNotAccepted'),
				action: getTransactionLink(data),
			});
		},
	});
};

export const useSinglePlayerTable = () => {
	return useQuery({
		queryKey: ['roulette', 'single', 'table'],
		queryFn: () => SINGLE_PLAYER_GAME,
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	});
};

const LIVE_TABLE_ROUTE_ID = '/games/roulette/live/$table' as const;
const SINGLE_PLAYER_ROUTE_IDS = new Set(['/games/roulette/single', '/games/roulette/single/']);

function isSinglePlayerRoulettePath(pathname: string): boolean {
	return SINGLE_PLAYER_ROUTE_IDS.has(pathname);
}

export const useVisibleTable = () => {
	const matches = useMatches();
	const params = useParams({ strict: false });
	const { pathname } = useLocation();
	const { data: single, isLoading } = useSinglePlayerTable();

	const liveTableMatch = useMemo(() => matches.find((m) => m.routeId === LIVE_TABLE_ROUTE_ID), [matches]);

	const onSinglePath = isSinglePlayerRoulettePath(pathname);

	const table = useMemo((): Address => {
		// Single-player UI must always use the house game — ignore stale `table` params from other routes (e.g. MF host paths).
		if (onSinglePath) return single ?? SINGLE_PLAYER_GAME ?? ZeroAddress;

		const fromLive = liveTableMatch?.params?.table as Address | undefined;
		const fromLoose = params.table as Address | undefined;
		const fromRoute = fromLive || fromLoose;
		if (fromRoute && fromRoute !== ZeroAddress) return fromRoute;

		// On live multiplayer route, subgraph + contracts use PUBLIC_MULTIPLAYER_GAME_ADDRESS — never fall back to single-player.
		if (liveTableMatch && MULTIPLAYER_GAME && MULTIPLAYER_GAME !== ZeroAddress) return MULTIPLAYER_GAME;

		return single ?? SINGLE_PLAYER_GAME ?? ZeroAddress;
	}, [liveTableMatch, onSinglePath, params.table, single]);

	const isSingle = onSinglePath;

	return {
		isSingle,
		table,
		isLoading,
	};
};

export const useVisibleRound = () => {
	const search: { round: number } = useSearch({ strict: false });

	return { round: search?.round ? Number(search.round) : 0 };
};

export const useAllBets = (table: Address, round: number) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'all', table, round],
		queryFn: () => fetchBetsBitMapAndAmountByRound(table, round),
		refetchOnWindowFocus: false,
	});
};

export const useScrollToHeader = () => {
	const scrollToHeader = () => {
		document.getElementById(BET_STATUS_HEADER)?.scrollIntoView({
			behavior: 'smooth',
		});
	};
	return { scrollToHeader };
};

export const useManualSpin = (roundId?: number | bigint) => {
	const config = useConfig();
	return useMutation({
		mutationKey: ['roulette', 'manualSpin', roundId ? roundId.toString() : 'global'],
		mutationFn: (e: { table: Address; round: bigint }) => manualSpin(config, e.round),
		onSuccess: async (data) => {
			await waitForTransactionReceipt(config.getClient(), { hash: data });
		},
	});
};
