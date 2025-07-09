import { cn } from '@betfinio/components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@betfinio/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { CircleHelp } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetSelectedRound, useTableRounds } from '@/src/lib/live-roulette/query';
import { lastResultPlaceholder } from '@/src/lib/shared';
import { useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { LastResultRow } from '../../shared/LastResultRow';

export const LastResults = () => {
	const { t } = useTranslation('roulette');
	const { table } = useVisibleTable();
	const { round } = useGetSelectedRound();

	const navigate = useNavigate();

	const { data: tableBets = [], isFetched: isBetsFetched } = useTableRounds(table);
	const numbers = useMemo(() => {
		const hasBets = tableBets.length > 0;
		const hasResults = hasBets && tableBets.some((r) => r.status === RoundStatus.FINISHED);
		if (hasResults) {
			return tableBets.map((r) => ({
				winNumber: r.status === RoundStatus.FINISHED ? r.winNumber : -1,
				status: r.status,
				round: r.round,
			}));
		}

		return lastResultPlaceholder.map((r) => ({ ...r, round: -1 }));
	}, [tableBets]);

	const lastSeven = useMemo(() => numbers.slice(0, 7).reverse(), [numbers]);

	const isAnyFinishedSelected = useMemo(() => lastSeven.some((r) => r.round === round && r.status === RoundStatus.FINISHED), [lastSeven, round]);

	return (
		<motion.div
			initial={{ opacity: 0, x: '-50%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 2 }}
			className={'rl:bg-card rl:rounded-lg rl:p-2 rl:mt-4 rl:border rl:border-border rl:shrink-0 rl:w-[122px]'}
		>
			<h3 className="rl:text-foreground rl:flex rl:justify-center rl:gap-1 rl:text-xs rl:font-medium rl:mb-1">
				{t('lastResults')}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<CircleHelp className={'rl:w-3 rl:h-3'} />
						</TooltipTrigger>
						<TooltipContent>{t('lastNumbersTooltip')}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</h3>
			<div className={cn('rl:flex rl:flex-col rl:gap-1', { 'rl:blur-xs rl:animate-pulse': !isBetsFetched })}>
				{lastSeven.map((result, index) => (
					<div
						key={index}
						className={cn('rl:grid rl:grid-cols-3 rl:gap-x-1 rl:transition-all', {
							'rl:opacity-60': isAnyFinishedSelected && round !== result.round,
							'rl:cursor-pointer': round !== result.round,
						})}
						onClick={() => navigate({ to: '/games/roulette/live/$table', params: { table }, search: { round: result.round } })}
					>
						<LastResultRow result={result} isActive={round === result.round} index={index + result.winNumber} />
					</div>
				))}
			</div>
		</motion.div>
	);
};
