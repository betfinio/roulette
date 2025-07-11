import { cn } from '@betfinio/components';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { SLIDE_DOWN_ANIMATION } from '@/src/animations';
import { getColor } from '@/src/lib/roulette';
import type { LastResult } from '@/src/lib/shared/types';

interface ILastResultRowProps {
	result: LastResult;
	isActive?: boolean;
	index: number;
}
export const LastResultRow: FC<ILastResultRowProps> = ({ result, isActive, index }) => {
	if (getColor(result.winNumber) === undefined) {
		return (
			<motion.div
				key={index}
				className={cn('aspect-square rounded-lg flex justify-center items-center w-8  blur-xs animate-pulse col-start-2 pointer-none', {
					'scale-130 origin-center   bg-accent': isActive,
					'scale-100 origin-center opacity-50': !isActive,
				})}
				animate={{
					x: ['0%', '-100%', '0%', '100%', '0%'],
				}}
				transition={{
					duration: 3,
					repeat: Number.POSITIVE_INFINITY,

					times: [0, 0.25, 0.5, 0.75, 1],
				}}
			>
				{result.winNumber}
			</motion.div>
		);
	}

	return (
		<motion.div
			key={index}
			className={cn('aspect-square text-foreground rounded-lg flex justify-center items-center transition-all pointer-none ', {
				'col-start-1 bg-red-roulette w-8': getColor(result.winNumber) === 'RED',
				'col-start-2 bg-green-roulette w-8': getColor(result.winNumber) === 'GREEN',
				'col-start-3 bg-black-roulette w-8': getColor(result.winNumber) === 'BLACK',
				'scale-120 origin-center scale-center': isActive,
				'scale-100 origin-center scale-center opacity-50': !isActive,
			})}
			{...SLIDE_DOWN_ANIMATION}
		>
			{result.winNumber}
		</motion.div>
	);
};
