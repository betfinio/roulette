import { useGetTableRounds } from '@/src/lib/live-roulette/query';
import { lastResultPlaceholder } from '@/src/lib/shared';
import { useGetTableAddress } from '@/src/lib/shared/query';
import { cn } from '@betfinio/components';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LastResultRow } from '../../shared/LastResultRow';

export const LastResults = () => {
	const { tableAddress } = useGetTableAddress();

	const { data: tableBets = [], isFetched: isBetsFetched } = useGetTableRounds(50, tableAddress);

	const numbers = useMemo(
		() =>
			tableBets.length > 0
				? tableBets.map((r) => ({
						winNumber: r.winNumber,
						status: r.status,
					}))
				: lastResultPlaceholder,
		[tableBets],
	);

	const lastSeven = useMemo(() => numbers.slice(0, 7).reverse(), [numbers]);

	return (
		<motion.div
			initial={{ opacity: 0, x: '-50%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 2 }}
			className={'bg-card rounded-lg p-2 mt-4 border border-border flex-shrink-0'}
		>
			<div className={cn('grid grid-cols-3 grid-rows-7 gap-1', { 'blur-sm animate-pulse': !isBetsFetched })}>
				{lastSeven.map((result, index) => (
					<LastResultRow result={result} key={index} index={index} />
				))}
			</div>
		</motion.div>
	);
};
