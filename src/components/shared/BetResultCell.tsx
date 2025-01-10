import { getColor } from '@/src/lib/roulette';
import { cn } from '@betfinio/components';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface BetResultCellProps {
	winNumber: number;
	inProgress?: boolean;
}
export const BetResultCell: FC<BetResultCellProps> = ({ winNumber, inProgress }) => {
	const { t } = useTranslation('roulette');
	if (inProgress) {
		return <div className="text-tertiary-foreground min-h-10 flex items-center">{t('table.waiting')}</div>;
	}
	return (
		<span
			className={cn('e w-10 h-10 rounded-xl flex justify-center font-semibold items-center p-3', {
				'bg-red-roulette': getColor(winNumber) === 'RED',
				'bg-black-roulette': getColor(winNumber) === 'BLACK',
				'bg-green-roulette': getColor(winNumber) === 'GREEN',
			})}
		>
			{winNumber}
		</span>
	);
};
