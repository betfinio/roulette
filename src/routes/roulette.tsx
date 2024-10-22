import { createFileRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Roulette } from '../components/roulette/Roulette';

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
