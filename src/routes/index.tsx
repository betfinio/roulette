import logger from '@/src/config/logger';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
	component: () => <Index />,
	beforeLoad: async () => {
		throw redirect({ to: './live-roulette' });
	},
});

function Index() {
	logger.success('Hello, world!');
	return <div className={'border border-red-roulette px-4 py-2 rounded-md text-white h-full'}>Title</div>;
}
