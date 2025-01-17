import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/games/')({
	beforeLoad: async () => {
		throw redirect({ to: '/games/roulette' });
	},
});
