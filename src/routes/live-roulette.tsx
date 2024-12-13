import { createFileRoute } from '@tanstack/react-router';
import { Roulette } from '../components/roulette/Roulette';

export const Route = createFileRoute('/live-roulette')({
	component: () => (
		<div className="">
			<Roulette />
		</div>
	),
});
