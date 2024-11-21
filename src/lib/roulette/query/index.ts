import logger from '@/src/config/logger';
import { ROULETTE } from '@/src/global.ts';
import {
	calculatePotentialWin,
	changeChip,
	clearAllBets,
	doublePlace,
	fetchChipsByPosition,
	fetchDebugMode,
	fetchLimits,
	fetchLocalBets,
	fetchSelectedChip,
	place,
	setDebugMode,
	spin,
	undoPlace,
	unplace,
} from '@/src/lib/roulette/api';
import type { ChiPlaceProps, Limit, LocalBet, RouletteBet, SpinParams, WheelState } from '@/src/lib/roulette/types.ts';
import { RouletteContract, ZeroAddress } from '@betfinio/abi';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce, useMediaQuery as useMediaQueryLib } from '@uidotdev/usehooks';
import type { WriteContractReturnType } from '@wagmi/core';
import { getTransactionLink } from 'betfinio_app/helpers';
import { toast } from 'betfinio_app/use-toast';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useConfig, useWatchContractEvent } from 'wagmi';
import { fetchAllBets, fetchBetsByPlayer } from '../gql';

export const useLocalBets = () =>
	useQuery<LocalBet[]>({
		queryKey: ['roulette', 'local', 'bets'],
		queryFn: fetchLocalBets,
	});

export const usePaytable = () => {
	const queryClient = useQueryClient();
	const { data: isOpen } = useQuery<boolean>({
		queryKey: ['roulette', 'paytable'],
		initialData: false,
	});

	return { isOpen, closePaytable: () => closePaytable(queryClient), openPaytable: () => openPaytable(queryClient) };
};

export const closePaytable = (queryClient: QueryClient) => {
	queryClient.setQueryData(['roulette', 'paytable'], false);
};

export const openPaytable = (queryClient: QueryClient) => {
	queryClient.setQueryData(['roulette', 'paytable'], true);
};

export const usePotentialWin = () => {
	const { data: bets = [] } = useLocalBets();
	const config = useConfig();
	const value = useDebounce(bets, 1000);
	return useQuery<bigint>({
		queryKey: ['roulette', 'local', 'bets', value],
		queryFn: async () => calculatePotentialWin(value, config),
	});
};

export const useLimits = () => {
	const config = useConfig();
	return useQuery<Limit[]>({
		queryKey: ['roulette', 'limits'],
		queryFn: () => fetchLimits(config),
	});
};

export const useRouletteBets = (address: Address) => {
	return useQuery<RouletteBet[]>({
		queryKey: ['roulette', 'bets', address],
		queryFn: () => fetchBetsByPlayer(address),
		refetchOnWindowFocus: false,
	});
};

export const useRouletteState = () => {
	const { address = ZeroAddress } = useAccount();
	const queryClient = useQueryClient();
	const state = useQuery<WheelState>({
		queryKey: ['roulette', 'state'],
		initialData: { state: 'standby' },
	});

	const updateState = (st: WheelState) => {
		queryClient.setQueryData(['roulette', 'state'], { ...state.data, ...st });
		queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
	};

	useWatchContractEvent({
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Rolled',

		onLogs: async (rolledLogs) => {
			// @ts-ignore
			if (rolledLogs[0].args.roller.toString().toLowerCase() === address.toLowerCase()) {
				updateState({ state: 'spinning' });
			}
		},
	});

	useWatchContractEvent({
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Landed',

		onLogs: async (landedLogs) => {
			// @ts-ignore
			if (landedLogs[0].args.roller.toString().toLowerCase() === address.toLowerCase()) {
				// @ts-ignore
				updateState({ state: 'landing', result: Number(landedLogs[0].args.result), bet: landedLogs[0].args.bet });
				queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
			}
		},
	});

	return { state, updateState };
};

export const useSelectedChip = () =>
	useQuery<number>({
		queryKey: ['roulette', 'chip'],
		queryFn: fetchSelectedChip,
	});

export const usePlace = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation('roulette', { keyPrefix: 'errors' });
	const { data: chip = 0 } = useSelectedChip();
	return useMutation<void, Error, ChiPlaceProps>({
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

export const useSpin = () => {
	const { t: errors } = useTranslation('shared', { keyPrefix: 'errors' });
	const { t } = useTranslation('roulette');
	const config = useConfig();
	const queryClient = useQueryClient();

	return useMutation<WriteContractReturnType, WriteContractErrorType, SpinParams>({
		mutationKey: ['roulette', 'spin'],
		mutationFn: (params) => spin(params, config),
		onError: (e) => {
			logger.error(e);
			// @ts-ignore
			if (e.cause?.reason) {
				// @ts-ignore
				if (e.cause.reason === 'RO04') {
					openPaytable(queryClient);
				}
				// @ts-ignore
				toast({ variant: 'destructive', description: errors(e.cause?.reason) });
				// @ts-ignore
			} else {
				toast({ variant: 'destructive', description: errors('unknown') });
			}
		},
		onSuccess: async (data) => {
			const { update } = toast({
				title: t('placingBet'),
				description: t('transactionIsPending'),
				variant: 'loading',
				duration: 10000,
			});
			await waitForTransactionReceipt(config.getClient(), { hash: data });
			update({ variant: 'default', description: t('transactionIsConfirmed'), title: t('betPlaced'), action: getTransactionLink(data), duration: 3000 });
			//	await queryClient.invalidateQueries({ queryKey: ['roulette'] });
		},
	});
};

export const useUnplace = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, ChiPlaceProps>({
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

export const useLastRouletteBets = (count: number) => {
	return useQuery<RouletteBet[]>({
		queryKey: ['roulette', 'bets', 'last', count],
		queryFn: () => fetchAllBets(count),
	});
};

// todo move to app
export const useMediaQuery = () => {
	const isMobile = useMediaQueryLib('(max-width: 639px)');
	const isTablet = useMediaQueryLib('(min-width: 640px) and (max-width: 1023px)');

	const isVertical = isMobile;

	return { isMobile, isTablet, isVertical };
};

export const useGetChipsForPosition = (position: string) => {
	return useQuery<LocalBet[]>({
		queryKey: ['roulette', 'local', 'bets', position],
		queryFn: () => fetchChipsByPosition(position),
	});
};

export const useGetDebugMode = () => {
	return useQuery<boolean>({
		queryKey: ['roulette', 'local', 'debug'],
		queryFn: fetchDebugMode,
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
	});

	const { data: bets = [] } = useLocalBets();

	const selected = bets.flatMap((e) => e.numbers);

	const updateState = (props: { hovered?: number[]; selected?: number[] }) => {
		queryClient.setQueryData(['roulette', 'numbers'], { ...state.data, ...props });
		queryClient.invalidateQueries({ queryKey: ['roulette', 'numbers'] });
	};

	const isNumberHovered = (number: number) => state.data.hovered.includes(number);
	const isNumberSelected = (number: number) => selected.includes(number);

	const onHoverNumbers = (numbers: number[]) => updateState({ hovered: numbers });
	const onLeaveHover = () => updateState({ hovered: [] });

	return { state, updateState, isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover };
};
