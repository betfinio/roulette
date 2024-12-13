import { getColor } from '@/src/lib/roulette';
import { cn } from '@betfinio/components';
import type { FC } from 'react';

interface BetResultCellProps {
	winNumber: number;
}
export const BetResultCell: FC<BetResultCellProps> = ({ winNumber }) => {
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
