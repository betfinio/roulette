import { cn } from '@betfinio/components';
import { LoaderIcon } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouletteNumberIcon } from './RouletteNumberIcon';

interface BetResultCellProps {
	winNumber: number;
	inProgress?: boolean;
}
export const BetResultCell: FC<BetResultCellProps> = ({ winNumber, inProgress }) => {
	const { t } = useTranslation('roulette');
	if (inProgress) {
		return <div className="text-tertiary-foreground min-h-10 flex items-center">{t('table.waiting')}</div>;
	}
	if (winNumber === 42) {
		return <div className={'text-muted-foreground h-10 flex justify-start items-center'}>Waiting</div>;
	}
	return <RouletteNumberIcon number={winNumber} className={cn('w-10 h-10  ')} />;
};
