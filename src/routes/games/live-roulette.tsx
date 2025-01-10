import { createFileRoute } from '@tanstack/react-router';
import { Roulette } from '../../components/roulette/Roulette';

export const Route = createFileRoute('/games/live-roulette')({
	component: () => (
		<div className="">
			<Roulette />
		</div>
	),
});
