import { BET_STATUS_HEADER } from '@/src/components/shared/BetStatusHeader/BetStatusHeader';
import logger from '@/src/config/logger';
import { fetchBetsBitMapAndAmountByRound } from '@/src/lib/shared/gql';
import { toast } from '@betfinio/components/hooks';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { getTransactionLink } from 'betfinio_context/lib/helpers';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType, WriteContractReturnType } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useConfig } from 'wagmi';
import {
	changeChip,
	clearAllBets,
	doublePlace,
	fetchBetInfo,
	fetchChipsByPosition,
	fetchDebugMode,
	fetchLimits,
	fetchLocalBets,
	fetchSelectedChip,
	fetchSinglePlayerAddress,
	manualSpin,
	place,
	submitBet,
	undoPlace,
	unplace,
} from '../api';
import type { ChipPlaceProps, LocalBet, SpinParams } from '../types';

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
	return useQuery({
		queryKey: ['roulette', 'local', 'bets', 'all'],
		queryFn: fetchLocalBets,
		refetchOnWindowFocus: false,
	});
};

export const useLimits = (table?: Address) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'limits'],
		queryFn: () => fetchLimits(config, table),
		refetchOnWindowFocus: false,
		enabled: !!table,
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
	return useMutation<void, Error, ChipPlaceProps>({
		mutationKey: ['roulette', 'place'],
		mutationFn: (e) => place(e, chip, t),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
		onError: (e) =>
			toast({
				variant: 'destructive',
				description: e.message,
			}),
	});
};
export const useUnplace = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, ChipPlaceProps>({
		mutationKey: ['roulette', 'unplace'],
		mutationFn: (e) => unplace(e),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
		onError: (e) => toast({ variant: 'destructive', description: e.message }),
	});
};
export const useDoublePlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['roulette', 'doublePlace'],
		mutationFn: doublePlace,
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
	});
};

export const useUndoPlace = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['roulette', 'undoPlace'],
		mutationFn: undoPlace,
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
	return useQuery({
		queryKey: ['roulette', 'local', 'bets', position],
		queryFn: () => fetchChipsByPosition(position),
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
	return useMutation({
		mutationKey: ['roulette', 'clear', 'bets'],
		mutationFn: () => clearAllBets(),
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
	const { t: errors } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t } = useTranslation('roulette');
	const config = useConfig();
	const queryClient = useQueryClient();
	const { isSingle } = useVisibleTable();

	return useMutation<WriteContractReturnType, WriteContractErrorType, SpinParams>({
		mutationKey: ['roulette', 'spin'],
		mutationFn: (params) => submitBet(params, config),
		onError: (e) => {
			logger.error(e);
			// @ts-ignore
			if (e.cause?.reason) {
				// @ts-ignore
				if (e.cause.reason === 'LT02' || e.cause.reason === 'LT03') {
					openPaytable(queryClient);
				}

				// @ts-ignore
				toast({ variant: 'destructive', description: errors(e.cause?.reason, { defaultValue: t(`errors.${e.cause?.reason}`) }) });
				// @ts-ignore
			} else {
				toast({ variant: 'destructive', description: errors('unknown') });
			}
		},
		onSuccess: async (data, variables) => {
			const { update, id } = toast({
				title: t('placingBet'),
				description: t('transactionIsPending'),
				variant: 'loading',
				duration: 10000,
			});
			const receipt = await waitForTransactionReceipt(config.getClient(), { hash: data });

			if (receipt.status === 'success') {
				update({ id, variant: 'default', description: t('transactionIsConfirmed'), title: t('betPlaced'), action: getTransactionLink(data), duration: 3000 });
				await clearAllBets();
				if (!isSingle) {
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] });
				}
				const allBets = queryClient.getQueryData<LocalBet[]>(['roulette', 'bets', 'all', variables.table, Number(variables.roundNumber)]) || [];
				queryClient.setQueryData(
					['roulette', 'bets', 'all', variables.table, Number(variables.roundNumber)],
					[...allBets, ...variables.bets.map((bet) => ({ ...bet, player: variables.playerAddress }))],
				);
			}
			if (receipt.status === 'reverted') {
				update({
					id,
					variant: 'destructive',
					description: t('betWasNotAccepted'),
					title: t('betNotPlaced'),
					action: getTransactionLink(data),
					duration: 3000,
				});
			}
		},
	});
};

export const useSinglePlayerTable = () => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'single', 'table'],
		queryFn: () => fetchSinglePlayerAddress(config),
		refetchOnWindowFocus: false,
	});
};

export const useVisibleTable = () => {
	const params = useParams({ strict: false });
	const { data: single, isLoading } = useSinglePlayerTable();
	const table: Address | undefined = useMemo(() => {
		return (params.table || single) as Address;
	}, [params, single]);
	return {
		isSingle: table === single,
		table: table,
		isLoading,
	};
};

export const useVisibleRound = () => {
	const search = useSearch({ strict: false });

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

export const useManualSpin = () => {
	const config = useConfig();
	return useMutation({
		mutationKey: ['roulette', 'manualSpin'],
		mutationFn: (e: { table: Address; round: bigint }) => manualSpin(config, e.table, e.round),
		onSuccess: async (data) => {
			await waitForTransactionReceipt(config.getClient(), { hash: data });
		},
	});
};

export const useBetInfo = () => {
	const config = useConfig();
	return useMutation({
		mutationKey: ['roulette', 'bet', 'info'],
		mutationFn: (bet: Address) => fetchBetInfo(config, bet),
	});
};
