import { cn } from '@betfinio/components';
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
		return <div className="rl:text-tertiary-foreground rl:min-h-10 rl:flex rl:items-center">{t('table.waiting')}</div>;
	}
	if (winNumber === 42) {
		return <div className={'rl:text-muted-foreground rl:h-10 rl:flex rl:justify-start rl:items-center'}>Waiting</div>;
	}
	return <RouletteNumberIcon number={winNumber} className={cn('rl:w-10 rl:h-10  ')} />;
};
