import { SLIDE_DOWN_ANIMATION } from '@/src/animations';
import { getColor } from '@/src/lib/roulette';
import { useRouletteBets } from '@/src/lib/roulette/query';
import { ZeroAddress } from '@betfinio/abi';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
export const PlayerStat = () => {
	const { t } = useTranslation('roulette');
	const { address = ZeroAddress } = useAccount();
	const { data: bets = [], isFetched: isBetsFetched } = useRouletteBets(address);
	const numbers = useMemo(() => (bets.length > 0 ? bets.map((e) => e.winNumber) : [1, 2, 0, 4, 1, 4, 6, 6]), [bets]);

	const counts = useMemo(() => _.countBy(numbers), [numbers]);
	const hot = useMemo(() => _.sortBy(numbers, (num) => -counts[num]).slice(0, 3), [numbers]);
	const cold = useMemo(() => _.sortBy(numbers, (num) => counts[num]).slice(0, 3), [numbers]);
	const { red = 0, black = 0 } = useMemo(() => {
		if (numbers.length === 0) return { red: 50, black: 50 };
		const counts = _.countBy(numbers, getColor);
		const totalCount = numbers.length || 1;
		const redCount = counts.RED || 0;
		const blackCount = counts.BLACK || 0;
		return { red: Math.floor((redCount / totalCount) * 100), black: Math.floor((blackCount / totalCount) * 100) };
	}, [numbers]);
	const { odd = 0, even = 0 } = useMemo(() => {
		if (numbers.length === 0) return { even: 50, odd: 50 };
		const counts = _.countBy(numbers, (n) => n % 2);
		const totalCount = numbers.length || 1;
		const oddCount = counts[1] || 0;
		const evenCount = counts[0] || 0;
		return { odd: Math.floor((oddCount / totalCount) * 100), even: Math.floor((evenCount / totalCount) * 100) };
	}, [numbers]);
	return (
		<motion.div
			initial={{ opacity: 0, x: '50%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 2 }}
			className="bg-card mt-4 p-2 rounded-lg border w-[122px] h-[266px] flex flex-col items-center justify-center border-border tabular-nums flex-shrink-0"
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
