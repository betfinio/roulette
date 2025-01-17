import { VersionValidation } from '@/src/components/VersionValidation';
import { Roulette } from '@/src/components/roulette/Roulette';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED, PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { useFetchTableBetByBlockHash, useGetRouletteTableStats, useRouletteState } from '@/src/lib/roulette/query';
import { LiveRouletteABI, ZeroAddress } from '@betfinio/abi';
import { Toaster } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';

export const Route = createFileRoute('/games/roulette/')({
	component: RoulettePage,
});

export function RoulettePage() {
	const { updateState } = useRouletteState();
	const { queryKey: rouletteTableStatQueryKey } = useGetRouletteTableStats();
	const queryClient = useQueryClient();

	const tableStatRefetchRef = useRef<ReturnType<typeof setTimeout>>();

	const { address = ZeroAddress } = useAccount();
	const { mutateAsync: fetchTableBetByBlockHash } = useFetchTableBetByBlockHash();
	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		onLogs: async (rolledLogs) => {
			const eventOfThePlayer = rolledLogs[0].args.player?.toString().toLowerCase() === address.toLowerCase();
			if (eventOfThePlayer) {
				updateState({ state: 'spinning' });
			}
		},
	});

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		onLogs: async (landedLogs) => {
			const eventOfThePlayer = landedLogs[0].args.player?.toString().toLowerCase() === address.toLowerCase();

			if (eventOfThePlayer) {
				const bet = await fetchTableBetByBlockHash(landedLogs[0].blockHash);
				bet &&
					updateState({
						state: 'landing',
						result: Number(landedLogs[0].args.value),
						bet,
					});

				if (tableStatRefetchRef.current) {
					clearTimeout(tableStatRefetchRef.current);
				}
				tableStatRefetchRef.current = setTimeout(() => {
					queryClient.refetchQueries({ queryKey: rouletteTableStatQueryKey });
				}, 5000);
			}
		},
	});

	return (
		<div className="roulette">
			<Roulette />
			<Toaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</div>
	);
}
