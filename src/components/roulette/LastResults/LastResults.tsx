import { cn } from '@betfinio/components';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetPlayerBets } from '@/src/lib/roulette/query';
import { lastResultPlaceholder } from '@/src/lib/shared';
import { useVisibleTable } from '@/src/lib/shared/query';
import { LastResultRow } from '../../shared/LastResultRow';

export const LastResults = () => {
	const { t } = useTranslation('roulette');
	const { table } = useVisibleTable();
	const { data: playerBets = [], isFetched: isBetsFetched } = useGetPlayerBets(table);
	const numbers = useMemo(
		() =>
			playerBets.length > 0
				? playerBets.map((r) => ({
						winNumber: r.winNumber,
						status: r.status,
					}))
				: lastResultPlaceholder,
		[playerBets],
	);

	const lastSeven = useMemo(() => numbers.slice(0, 7).reverse(), [numbers]);

	return (
		<motion.div
			initial={{ opacity: 0, x: '-50%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 2 }}
			className={'rl:bg-card rl:rounded-lg rl:p-2 rl:mt-4 rl:border rl:border-border rl:shrink-0 rl:w-[122px]'}
		>
			<h3 className="rl:text-foreground rl:flex rl:justify-center rl:text-xs rl:font-medium rl:mb-1">{t('lastResults')}</h3>
			<div className={cn('rl:flex rl:flex-col rl:gap-1', { 'rl:blur-xs rl:animate-pulse': !isBetsFetched })}>
				{lastSeven.map((result, index) => (
					<div key={index} className={cn('rl:grid rl:grid-cols-3 rl:gap-x-1 rl:transition-all', {})}>
						<LastResultRow result={result} index={index} />
					</div>
				))}
			</div>
		</motion.div>
	);
};
