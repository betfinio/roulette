import { createFileRoute } from '@tanstack/react-router';
import { WheelProvider } from '../contexts/WheelContext';
import { Game } from '../game/Game';

export const Route = createFileRoute('/roulette')({
	component: () => (
		<div className="">
			<WheelProvider>
				<Game />
			</WheelProvider>
		</div>
	),
});
