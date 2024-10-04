import { cn } from '@/lib/utils';
import { getColor } from '@/src/lib/roulette';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';

interface ILastResultRowProps {
	result: number;
	index: number;
}
export const LastResultRow: FC<ILastResultRowProps> = ({ result, index }) => {
	return (
		<motion.div
			className={cn(
				'aspect-square text-foreground rounded-lg flex justify-center items-center w-8',

				{
					'col-start-1 bg-red-roulette': getColor(result) === 'RED',
					'col-start-2 bg-green-roulette': getColor(result) === 'GREEN',
					'col-start-3 bg-black-roulette': getColor(result) === 'BLACK',
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
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.5 }}
		>
			{result}
		</motion.div>
	);
};
