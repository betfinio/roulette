import { RouletteContract } from '@betfinio/abi';
import { createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useWatchContractEvent } from 'wagmi';
import { Roulette } from '../components/roulette/Roulette';
import { ROULETTE } from '../global';

const queryClient = new QueryClient();

export const Route = createFileRoute('/roulette')({
	component: RoulettePage,
});

function RoulettePage() {
	useWatchContractEvent({
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Rolled',
		onLogs: () => {},
	});

	useWatchContractEvent({
		abi: RouletteContract.abi,
		address: ROULETTE,
		eventName: 'Landed',
		onLogs: () => {},
	});

	return (
		<div className="">
			<QueryClientProvider client={queryClient}>
				<Roulette />
			</QueryClientProvider>
		</div>
	);
}
