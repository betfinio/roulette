import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
	component: () => <Index />,
});

function Index() {
	const { t } = useTranslation('', { keyPrefix: 'template' });
	return (
		<div
			className={
				'border border-red-roulette px-4 py-2 rounded-md text-white h-full'
			}
		>
			{t('title')}
		</div>
	);
}
