import { SLIDE_DOWN_ANIMATION } from '@/src/animations';
import { getColor } from '@/src/lib/roulette';
import { type LastResult, RoundStatus } from '@/src/lib/shared/types';
import { cn } from '@betfinio/components';
import { motion } from 'framer-motion';
import type { FC } from 'react';

interface ILastResultRowProps {
	result: LastResult;
	index: number;
}
export const LastResultRow: FC<ILastResultRowProps> = ({ result, index }) => {
	return (
		<motion.div
			className={cn(
				'aspect-square text-foreground rounded-lg flex justify-center items-center ',

				{
					'col-start-1 bg-red-roulette w-8': getColor(result.winNumber) === 'RED' && result.status === RoundStatus.FINISHED,
					'col-start-2 bg-green-roulette w-8': getColor(result.winNumber) === 'GREEN' && result.status === RoundStatus.FINISHED,
					'col-start-3 bg-black-roulette w-8': getColor(result.winNumber) === 'BLACK' && result.status === RoundStatus.FINISHED,
					'blur-sm animate-pulse w-full': result.status === RoundStatus.CREATED,
				},
				{
					'row-start-1': index === 0,
					'row-start-2': index === 1,
					'row-start-3': index === 2,
					'row-start-4': index === 3,
					'row-start-5': index === 4,
					'row-start-6': index === 5,
					'row-start-7': index === 6,
				},
			)}
			{...SLIDE_DOWN_ANIMATION}
		>
			{result.winNumber}
		</motion.div>
	);
};
