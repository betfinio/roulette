import { ZeroAddress } from '@betfinio/abi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { fetchAllPlayersBets, fetchPlayerBets, fetchRouletteTableStats, fetchTransactionHashByBet } from '../gql';
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
		queryKey: ['roulette', 'bets', 'player', address, table],
		queryFn: () => fetchPlayerBets(address, table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};

export const useGetAllPlayersBets = (table?: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bets', 'player', 'all'],
		queryFn: () => fetchAllPlayersBets(table),
		refetchOnWindowFocus: false,
		enabled: !!table,
	});
};

export const useGetTransactionHashByBet = (bet: Address) => {
	return useQuery({
		queryKey: ['roulette', 'bet', 'transactionHash', bet],
		queryFn: () => fetchTransactionHashByBet(bet),
		refetchOnWindowFocus: false,
	});
};

export const useGetRouletteTableStats = () => {
	const { address: playerAddress } = useAccount();

	const queryKey = ['roulette', 'bet', 'stat', playerAddress];
	return {
		queryKey,
		...useQuery({
			queryKey,
			queryFn: () => fetchRouletteTableStats(),
			refetchOnWindowFocus: false,
			staleTime: Number.POSITIVE_INFINITY,
		}),
	};
};
