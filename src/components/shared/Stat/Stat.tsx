import { cn } from '@betfinio/components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@betfinio/components/ui';
import { CircleHelp } from 'lucide-react';
import { motion } from 'motion/react';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SLIDE_DOWN_ANIMATION } from '@/src/animations';
import type { IRouletteStat } from '@/src/lib/shared/types';

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
			className={cn(
				'rl:bg-card rl:mt-4 rl:p-2 rl:rounded-lg rl:border rl:w-[122px] rl:h-[286px] rl:flex rl:flex-col rl:items-center  rl:border-border rl:tabular-nums rl:shrink-0 rl:gap-2',
				{
					'rl:animate-pulse rl:blur-xs': isLoading,
				},
			)}
		>
			<motion.div {...SLIDE_DOWN_ANIMATION} className="rl:text-center rl:mb-2">
				<div className="rl:text-foreground rl:text-xs rl:font-medium rl:flex rl:items-center rl:gap-1 rl:justify-center">
					{t('playerStat.hotAndCold')}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<CircleHelp className={'rl:w-3 rl:h-3'} />
							</TooltipTrigger>
							<TooltipContent>{t('playerStat.hotAndColdTooltip')}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="rl:flex rl:justify-center rl:items-center rl:rounded-md rl:p-1 rl:gap-4">
					<div className="rl:flex rl:flex-col rl:items-center rl:bg-red-roulette rl:rounded-md rl:w-8   rl:py-1">
						{hot.map((num, index) => (
							<div className="rl:py-1" key={index}>
								{num}
							</div>
						))}
					</div>

					<div className="rl:flex rl:flex-col rl:items-center rl:bg-bonus rl:rounded-md rl:w-8   rl:py-1">
						{cold.map((num, index) => (
							<div className="rl:py-1" key={index}>
								{num}
							</div>
						))}
					</div>
				</div>
			</motion.div>

			<motion.div {...SLIDE_DOWN_ANIMATION} className="rl:mb-2">
				<h3 className=" rl:text-xs rl:text-center">{t('playerStat.redAndBlack')}</h3>
				<div className="rl:flex rl:justify-center rl:text-xs rl:items-center rl:gap-4">
					<div className="rl:flex rl:flex-col rl:items-center rl:w-8 rl:bg-red-roulette rl:rounded-md rl:py-2   rl:border rl:border-border">{red}%</div>

					<div className="rl:flex rl:flex-col rl:items-center rl:w-8 rl:py-2  rl:border rl:border-border rl:rounded-md">{black}%</div>
				</div>
			</motion.div>

			<motion.div {...SLIDE_DOWN_ANIMATION} className="">
				<h3 className=" rl:text-xs rl:text-center">{t('playerStat.oddAndEven')}</h3>
				<div className="rl:flex rl:justify-center rl:items-center rl:border rl:border-border rl:rounded-md rl:text-xs rl:p-1 rl:w-20 rl:h-10 rl:mx-auto">
					<div className="rl:flex rl:items-center rl:justify-between rl:w-full  ">
						<div className="rl:w-1/2 text-center">{odd}%</div>
						<div className="rl:w-1/2 text-center">{even}%</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};
