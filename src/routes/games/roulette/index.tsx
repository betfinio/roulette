import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/games/roulette/')({
	beforeLoad: () => {
		throw redirect({ to: '/games/roulette/single' });
	},
});
