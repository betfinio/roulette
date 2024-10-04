import { cn } from '@/lib/utils';
import { useRouletteBets } from '@/src/lib/roulette/query';
import { ZeroAddress } from '@betfinio/abi';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { LastResultRow } from './LastResultRow';

export const LastResults = () => {
	const { address = ZeroAddress } = useAccount();
	const { data: bets = [], isFetched: isBetsFetched } = useRouletteBets(address);
	const numbers = useMemo(() => (bets.length > 0 ? bets.map((e) => e.winNumber) : [1, 2, 3, 4, 5, 6, 0]), [bets]);

	const lastSeven = useMemo(() => numbers.slice(0, 7).reverse(), [numbers]);
	return (
		<div className={'bg-card rounded-lg p-2 mt-4 border border-border '}>
			<div className={cn('grid grid-cols-3 grid-rows-7 gap-1', { 'blur-sm animate-pulse': !isBetsFetched })}>
				{lastSeven.map((result, index) => (
					<LastResultRow result={result} key={index} index={index} />
				))}
			</div>
		</div>
	);
};
