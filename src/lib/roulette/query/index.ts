import { fetchTableBetByBlockHash } from '@/src/lib/roulette/api';
import { ZeroAddress } from '@betfinio/abi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { useGetTableAddress } from '../../shared/query';
import { fetchAllPlayersBets, fetchPlayerBets, fetchTransactionHashByBet } from '../gql';
import type { WheelState } from '../types';

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

export const useGetPlayerBets = (table?: Address) => {
	const { address = ZeroAddress } = useAccount();
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', address],
		queryFn: () => fetchPlayerBets(address, table),
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

export const useFetchTableBetByBlockHash = () => {
	const config = useConfig();

	const { tableAddress } = useGetTableAddress();
	return useMutation({
		mutationKey: ['roulette', 'bet', 'blockHash'],
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
