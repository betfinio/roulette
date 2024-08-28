import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/roulette')({
	component: () => <div>Hello /roulette!</div>,
});
