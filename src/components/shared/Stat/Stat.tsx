import { SLIDE_DOWN_ANIMATION } from '@/src/animations';
import type { IRouletteStat } from '@/src/lib/shared/types';
import { cn } from '@betfinio/components';
import { motion } from 'framer-motion';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface IStatProps {
	tableOrPlayerStat?: IRouletteStat;
	isLoading?: boolean;
}
export const Stat: FC<IStatProps> = ({ tableOrPlayerStat, isLoading }) => {
	const { t } = useTranslation('roulette');
	const { black, red, odd, cold, even, hot }: IRouletteStat = useMemo(() => {
		const rouletteNumbers = Array.from({ length: 37 }, (_, i) => i); // Numbers 0 to 36
		const rouletteState: IRouletteStat = {
			black: 1,
			cold: [],
			even: 1,
			hot: [],
			odd: 1,
			red: 1,
			totalRolls: 1,
		};

		// Helper function to fill missing numbers randomly
		const fillMissingNumbers = (current: number[], count: number) => {
			while (current.length < count) {
				const randomNum = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
				if (!current.includes(randomNum)) {
					current.push(randomNum);
				}
			}
			return current;
		};

		const hot = fillMissingNumbers([...(tableOrPlayerStat?.hot ?? [])], 3);
		const cold = fillMissingNumbers([...(tableOrPlayerStat?.cold ?? [])], 3);

		if (!tableOrPlayerStat) {
			return { ...(rouletteState ?? []), hot, cold };
		}

		return { ...tableOrPlayerStat, hot, cold };
	}, [tableOrPlayerStat]);

	return (
		<motion.div
			initial={{ opacity: 0, x: '50%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 2 }}
			className={cn('bg-card mt-4 p-2 rounded-lg border w-[122px] h-[286px] flex flex-col items-center  border-border tabular-nums flex-shrink-0 gap-2', {
				'animate-pulse blur-sm': isLoading,
			})}
		>
			<motion.div {...SLIDE_DOWN_ANIMATION} className="text-center mb-2">
				<h3 className="text-foreground text-xs font-medium">{t('playerStat.hotAndCold')}</h3>
				<div className="flex justify-center items-center rounded-md p-1 gap-4">
					<div className="flex flex-col items-center bg-red-roulette rounded-md w-8   py-1">
						{hot.map((num, index) => (
							<div className="py-1" key={index}>
								{num}
							</div>
						))}
					</div>

					<div className="flex flex-col items-center bg-bonus rounded-md w-8   py-1">
						{cold.map((num, index) => (
							<div className="py-1" key={index}>
								{num}
							</div>
						))}
					</div>
				</div>
			</motion.div>

			<motion.div {...SLIDE_DOWN_ANIMATION} className="mb-2">
				<h3 className=" text-xs text-center">{t('playerStat.redAndBlack')}</h3>
				<div className="flex justify-center text-xs items-center gap-4">
					<div className="flex flex-col items-center w-8 bg-red-roulette rounded-md py-2   border border-border">{red}%</div>

					<div className="flex flex-col items-center w-8 py-2  border border-border rounded-md">{black}%</div>
				</div>
			</motion.div>

			<motion.div {...SLIDE_DOWN_ANIMATION} className="">
				<h3 className=" text-xs text-center">{t('playerStat.oddAndEven')}</h3>
				<div className="flex justify-center items-center border border-border rounded-md text-xs p-1 w-20 h-10 mx-auto">
					<div className="flex items-center justify-between w-full  ">
						<div className="w-1/2 text-center">{odd}%</div>
						<div className="w-1/2 text-center">{even}%</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};
