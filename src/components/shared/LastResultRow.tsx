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
				className={cn(
					'rl:aspect-square rl:rounded-lg rl:flex rl:justify-center rl:items-center rl:w-8  rl:blur-xs rl:animate-pulse rl:col-start-2 rl:pointer-none',
					{
						'rl:scale-130 rl:origin-center   rl:bg-accent': isActive,
						'rl:scale-100 rl:origin-center rl:opacity-50': !isActive,
					},
				)}
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
			className={cn('rl:aspect-square rl:text-foreground rl:rounded-lg rl:flex rl:justify-center rl:items-center rl:transition-all rl:pointer-none ', {
				'rl:col-start-1 rl:bg-red-roulette rl:w-8': getColor(result.winNumber) === 'RED',
				'rl:col-start-2 rl:bg-green-roulette rl:w-8': getColor(result.winNumber) === 'GREEN',
				'rl:col-start-3 rl:bg-black-roulette rl:w-8': getColor(result.winNumber) === 'BLACK',
				'rl:scale-120 rl:origin-center rl:scale-center': isActive,
				'rl:scale-100 rl:origin-center rl:scale-center rl:opacity-50': !isActive,
			})}
			{...SLIDE_DOWN_ANIMATION}
		>
			{result.winNumber}
		</motion.div>
	);
};
