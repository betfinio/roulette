import logger from '@/src/config/logger';
import {
	calculatePotentialWin,
	changeChip,
	clearAllBets,
	doublePlace,
	fetchChipsByPosition,
	fetchCurrentRoundOfTable,
	fetchDebugMode,
	fetchLimits,
	fetchLocalBets,
	fetchSelectedChip,
	fetchSinglePlayerAddress,
	fetchTableBetByBlockHash,
	place,
	setDebugMode,
	submitBet,
	undoPlace,
	unplace,
} from '@/src/lib/roulette/api';
import type { ChiPlaceProps, SpinParams, WheelState } from '@/src/lib/roulette/types.ts';
import { ZeroAddress } from '@betfinio/abi';
import { toast } from '@betfinio/components/hooks';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useDebounce } from '@uidotdev/usehooks';
import type { WriteContractReturnType } from '@wagmi/core';
import { getTransactionLink } from 'betfinio_app/helpers';
import { useTranslation } from 'react-i18next';
import type { Address, WriteContractErrorType } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, useConfig } from 'wagmi';
import { fetchAllPlayersBets, fetchPlayerBets, fetchTableAllRounds, fetchTableBets, fetchTablePlayerRounds, fetchTransactionHashByBet } from '../gql';

export const useLocalBets = () => {
	return useQuery({
		queryKey: ['roulette', 'local', 'bets', 'all'],
		queryFn: fetchLocalBets,
		refetchOnWindowFocus: false,
	});
};

export const usePaytable = () => {
	const queryClient = useQueryClient();
	const { data: isOpen } = useQuery<boolean>({
		queryKey: ['roulette', 'paytable'],
		initialData: false,
		refetchOnWindowFocus: false,
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

export const useRouletteState = () => {
	const queryClient = useQueryClient();
	const state = useQuery<WheelState>({
		queryKey: ['roulette', 'state'],
		initialData: { state: 'standby' },
	});

	const updateState = (st: WheelState) => {
		queryClient.setQueryData(['roulette', 'state'], { ...state.data, ...st });
		queryClient.refetchQueries({ queryKey: ['roulette', 'state'] });
	};

	return { state, updateState };
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
			await waitForTransactionReceipt(config.getClient(), { hash: data });
			update({ id, variant: 'default', description: t('transactionIsConfirmed'), title: t('betPlaced'), action: getTransactionLink(data), duration: 3000 });
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

	const selected = bets.flatMap((e) => e.numbers);

	const updateState = (props: { hovered?: number[]; selected?: number[] }) => {
		queryClient.setQueryData(['roulette', 'numbers'], { ...state.data, ...props });
		//	queryClient.invalidateQueries({ queryKey: ['roulette', 'numbers'] });
	};

	const isNumberHovered = (number: number) => {
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

export const useGetPlayerBets = (table?: Address) => {
	const { address = ZeroAddress } = useAccount();
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', address],
		queryFn: () => fetchPlayerBets(address, table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};
export const useGetTablePlayerRounds = (tableAddress?: Address) => {
	const { address = ZeroAddress } = useAccount();
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', address, tableAddress],
		queryFn: () => fetchTablePlayerRounds(address, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
	});
};
export const useGetTableBets = (table?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'table', table],
		queryFn: () => fetchTableBets(table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};
export const useGetAllPlayersBets = (last: number, table?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', 'all'],
		queryFn: () => fetchAllPlayersBets(last, table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};
export const useGetTableRounds = (last: number, tableAddress?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'table', 'rounds', tableAddress],
		queryFn: () => fetchTableAllRounds(last, tableAddress),
		refetchOnWindowFocus: false,
		enabled: !!tableAddress,
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

export const useGetCurrentRound = (tableAddress: Address) => {
	const config = useConfig();

	return useQuery({
		queryKey: ['roulette', 'currentRound', tableAddress],
		queryFn: () => fetchCurrentRoundOfTable(config, tableAddress),
		refetchOnWindowFocus: false,
	});
};

export const useFetchTableBetByBlockHash = () => {
	const config = useConfig();

	const { tableAddress } = useGetTableAddress();
	return useMutation({
		mutationKey: ['roulette', 'fetchTableBetByBlockHash'],
		mutationFn: (blockHash: Address) => fetchTableBetByBlockHash(config, blockHash, tableAddress),
	});
};

export const useGetTransactionHashByBet = (bet: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bet', 'transactionHash', bet],
		queryFn: () => fetchTransactionHashByBet(bet),
		refetchOnWindowFocus: false,
	});
};
