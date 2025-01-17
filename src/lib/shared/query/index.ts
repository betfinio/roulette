import { BET_STATUS_HEADER } from '@/src/components/shared/BetStatusHeader/BetStatusHeader';
import logger from '@/src/config/logger';
import { toast } from '@betfinio/components/hooks';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { getTransactionLink } from 'betfinio_context/lib/helpers';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType, WriteContractReturnType } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useConfig } from 'wagmi';
import {
	changeChip,
	clearAllBets,
	doublePlace,
	fetchBetInfo,
	fetchBetsBitMapAndAmount,
	fetchChipsByPosition,
	fetchDebugMode,
	fetchLimits,
	fetchLocalBets,
	fetchSelectedChip,
	fetchSinglePlayerAddress,
	manualSpin,
	place,
	setDebugMode,
	submitBet,
	undoPlace,
	unplace,
} from '../api';
import { fetchBetsBitMapAndAmountByRound } from '../gql';
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

export const useLimits = (tableAddress?: Address) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'limits'],
		queryFn: () => fetchLimits(config, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
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
export const useGetChipsForPosition = (position: string) => {
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

export const useSetDebugMode = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, boolean>({
		mutationKey: ['roulette', 'local', 'debug'],
		mutationFn: (e) => setDebugMode(e),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'debug'] }),
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
	const { state: othersState } = useRouletteOthersBetsState();

	const hasOtherState = othersState.data.selectedBetChips && othersState.data.selectedBetChips.length > 0;

	const selected = othersState.data.selectedBetChips ? othersState.data.selectedBetChips.flatMap((e) => e.numbers) : bets.flatMap((e) => e.numbers);

	const updateState = (props: { hovered?: number[]; selected?: number[] }) => {
		queryClient.setQueryData(['roulette', 'numbers'], { ...state.data, ...props });
		//	queryClient.invalidateQueries({ queryKey: ['roulette', 'numbers'] });
	};

	const isNumberHovered = (number: number) => {
		if (hasOtherState) return false;
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
		onSuccess: async (data) => {
			const { update, id } = toast({
				title: t('placingBet'),
				description: t('transactionIsPending'),
				variant: 'loading',
				duration: 10000,
			});
			const reciept = await waitForTransactionReceipt(config.getClient(), { hash: data });
			if (reciept.status === 'success') {
				update({ id, variant: 'default', description: t('transactionIsConfirmed'), title: t('betPlaced'), action: getTransactionLink(data), duration: 3000 });
			}
			if (reciept.status === 'reverted') {
				update({
					id,
					variant: 'destructive',
					description: t('transactionIsReverted'),
					title: t('betNotPlaced'),
					action: getTransactionLink(data),
					duration: 3000,
				});
			}
		},
	});
};

export const useGetSinglePlayerTableAddress = (enabled = true) => {
	const config = useConfig();
	return useQuery({
		queryKey: ['roulette', 'singlePlayer', 'address'],
		queryFn: () => fetchSinglePlayerAddress(config),
		refetchOnWindowFocus: false,
		enabled,
	});
};

export const useGetTableAddress = () => {
	const multiplayerTableAddress = useParams({ strict: false, select: (params) => params.table as Address | undefined });
	const { data: siglePlayerTableAddress, isLoading } = useGetSinglePlayerTableAddress(!multiplayerTableAddress);

	return { isSingle: !multiplayerTableAddress, tableAddress: multiplayerTableAddress || siglePlayerTableAddress, isLoading };
};

export const useGetBetAmountAndBitMap = (bet: Address) => {
	const config = useConfig();
	return useMutation<LocalBet[], Error, Address>({
		mutationKey: ['roulette', 'bet', 'amount', 'bitmap', bet],
		mutationFn: () => fetchBetsBitMapAndAmount(config, bet),
	});
};
export const useGetBetsAmountAndBitMapByRound = () => {
	return useMutation<LocalBet[], Error, { round: number; table: Address }>({
		mutationKey: ['roulette', 'bets', 'amount', 'bitmaps'],
		mutationFn: ({ round, table }: { round: number; table: Address }) => fetchBetsBitMapAndAmountByRound(table, round),
	});
};

export const useRouletteOthersBetsState = () => {
	const queryClient = useQueryClient();
	const state = useQuery<{ selectedBetChips: LocalBet[] | null }>({
		queryKey: ['roulette', 'selectedBetChips'],
		initialData: { selectedBetChips: null },
		refetchOnWindowFocus: false,
	});
	const updateState = (props: { selectedBetChips: LocalBet[] | null }) => {
		queryClient.setQueryData(['roulette', 'selectedBetChips'], { ...state.data, ...props });
		queryClient.refetchQueries({ queryKey: ['roulette', 'local', 'bets'] });
	};

	return { state, updateState };
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
		mutationFn: (e: { tableAddress: Address; round: bigint }) => manualSpin(config, e.tableAddress, e.round),
	});
};

export const useGetBetInfo = () => {
	const config = useConfig();
	return useMutation({
		mutationKey: ['roulette', 'bet', 'info'],
		mutationFn: (bet: Address) => fetchBetInfo(config, bet),
	});
};
