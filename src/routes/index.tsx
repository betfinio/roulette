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
	const { t } = useTranslation('', { keyPrefix: 'liro' });
	logger.success('Hello, world!');
	return <div className={'border border-red-roulette px-4 py-2 rounded-md text-white h-full'}>{t('title')}</div>;
}
