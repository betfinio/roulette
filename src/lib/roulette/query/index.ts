import { ROULETTE } from '@/src/global.ts';
import {
	calculatePotentialWin,
	changeChip,
	doublePlace,
	fetchLastRouletteBets,
	fetchLimits,
	fetchLocalBets,
	fetchProofTx,
	fetchRouletteBets,
	fetchSelectedChip,
	place,
	spin,
	undoPlace,
	unplace,
} from '@/src/lib/roulette/api';
import type { FuncProps, Limit, LocalBet, RouletteBet, SpinParams, WheelState } from '@/src/lib/roulette/types.ts';
import { RouletteContract } from '@betfinio/abi';
import { ZeroAddress } from '@betfinio/abi';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
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
		queryClient.setQueryData(['roulette', 'state'], st);
	};

	useWatchContractEvent({
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Rolled',
		onLogs: (rolledLogs) => {
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
		onLogs: (landedLogs) => {
			// @ts-ignore
			if (landedLogs[0].args.roller.toString().toLowerCase() === address.toLowerCase()) {
				// @ts-ignore
				updateState({ state: 'landed', result: Number(landedLogs[0].args.result), bet: landedLogs[0].args.bet });
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
	const { data: chip = 0 } = useSelectedChip();
	return useMutation<void, Error, FuncProps>({
		mutationKey: ['roulette', 'place'],
		mutationFn: (e) => place(e, chip),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] }),
		onError: (e) =>
			toast({
				variant: 'destructive',
				message: e.message,
			}),
	});
};

export const useSpin = () => {
	const { t: errors } = useTranslation('shared', { keyPrefix: 'errors' });
	const config = useConfig();
	const queryClient = useQueryClient();

	return useMutation<WriteContractReturnType, WriteContractErrorType, SpinParams>({
		mutationKey: ['roulette', 'spin'],
		mutationFn: (params) => spin(params, config),
		onError: (e) => {
			// @ts-ignore
			if (e.cause?.reason) {
				// @ts-ignore
				if (e.cause.reason === 'RO04') {
					openPaytable(queryClient);
				}
				// @ts-ignore
				toast({ variant: 'destructive', description: errors(e.cause.reason) });
			} else {
				toast({ variant: 'destructive', description: errors('unknown') });
			}
		},
		onSuccess: async (data) => {
			const { update } = toast({
				title: 'Placing a bet',
				description: 'Transaction is pending',
				variant: 'loading',
				duration: 10000,
			});
			await waitForTransactionReceipt(config.getClient(), { hash: data });
			update({ variant: 'default', description: 'Transaction is confirmed', title: 'Bet placed', action: getTransactionLink(data), duration: 3000 });
			await queryClient.invalidateQueries({ queryKey: ['roulette'] });
			console.log(data);
		},
	});
};

export const useUnplace = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, FuncProps>({
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

export const useProofRandom = (request: bigint) => {
	const config = useConfig();
	return useQuery({
		initialData: ZeroAddress,
		queryKey: ['roulette', 'proof', request.toString()],
		queryFn: () => fetchProofTx(request, config),
	});
};
