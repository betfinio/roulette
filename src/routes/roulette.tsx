import { createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Roulette } from '../components/roulette/Roulette';
import { WheelProvider } from '../contexts/WheelContext';
import { Game } from '../game/Game';

const queryClient = new QueryClient();

export const Route = createFileRoute('/roulette')({
	component: RoulettePage,
});

function RoulettePage() {
	return (
		<div className="">
			<QueryClientProvider client={queryClient}>
				<Roulette />
			</QueryClientProvider>
		</div>
	);
}
