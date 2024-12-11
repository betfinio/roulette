import { useGetBetResultCell } from '@/src/lib/roulette/query';
import { valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { Loader } from 'lucide-react';
import type { FC } from 'react';
import type { Address } from 'viem';

interface WinAmountCellProps {
	amount: bigint;
}
export const WinAmountCell: FC<WinAmountCellProps> = ({ amount }) => {
	return (
		<span className={cn('font-semibold text-tertiary-foreground', amount > 0n && '!text-success')}>
			<BetValue value={valueToNumber(amount)} />
		</span>
	);
};
