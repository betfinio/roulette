import { createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WheelProvider } from '../contexts/WheelContext';
import { Game } from '../game/Game';

const queryClient = new QueryClient();

export const Route = createFileRoute('/live-roulette')({
	component: () => (
		<div className="">
			<QueryClientProvider client={queryClient}>
				<WheelProvider>
					<Game />
				</WheelProvider>
			</QueryClientProvider>
		</div>
	),
});
