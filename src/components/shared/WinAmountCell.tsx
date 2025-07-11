import { valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface WinAmountCellProps {
	amount: bigint;
	inProgress?: boolean;
}
export const WinAmountCell: FC<WinAmountCellProps> = ({ amount, inProgress }) => {
	const { t } = useTranslation('roulette');

	if (inProgress) {
		return <span className="rl:text-tertiary-foreground">{t('table.waiting')}</span>;
	}
	return (
		<span className={cn('rl:font-semibold rl:text-tertiary-foreground', amount > 0n && 'rl:text-success')}>
			<BetValue value={valueToNumber(amount)} />
		</span>
	);
};
