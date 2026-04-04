import { SonnerToaster } from '@betfinio/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Roulette } from '@/src/components/roulette/Roulette';

export const Route = createFileRoute('/games/roulette/single/')({
	component: RoulettePage,
});

export function RoulettePage() {
	return (
		<div>
			<Roulette />
			<SonnerToaster />
		</div>
	);
}
