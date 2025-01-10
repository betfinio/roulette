import logger from '@/src/config/logger';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/games/')({
	component: () => <Index />,
	beforeLoad: async () => {
		throw redirect({ to: '/games/roulette' });
	},
});

function Index() {
	logger.success('Hello, world!');
	return <div className={'border border-red-roulette px-4 py-2 rounded-md  h-full'}>Title</div>;
}
