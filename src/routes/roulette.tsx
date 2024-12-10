import { LiveRouletteABI, ZeroAddress } from '@betfinio/abi';
import { createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { Roulette } from '../components/roulette/Roulette';
import { PUBLIC_LIRO_ADDRESS } from '../global';
import { useRouletteState } from '../lib/roulette/query';

const queryClient = new QueryClient();

export const Route = createFileRoute('/roulette')({
	component: RoulettePage,
});

function RoulettePage() {
	const { updateState } = useRouletteState();

	const { address = ZeroAddress } = useAccount();

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
				updateState({ state: 'landing', result: Number(landedLogs[0].args.value), bet: ZeroAddress });
				queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
			}
		},
	});

	return (
		<div className="">
			<QueryClientProvider client={queryClient}>
				<Roulette />
			</QueryClientProvider>
		</div>
	);
}
