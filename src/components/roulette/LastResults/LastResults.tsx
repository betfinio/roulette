import { useRouletteBets } from '@/src/lib/roulette/query';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { LastResultRow } from './LastResultRow';

export const LastResults = () => {
	const { address = ZeroAddress } = useAccount();
	const { data: bets = [], isFetched: isBetsFetched } = useRouletteBets(address);
	const numbers = useMemo(() => (bets.length > 0 ? bets.map((e) => e.winNumber) : [1, 2, 3, 4, 5, 6, 0]), [bets]);

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
