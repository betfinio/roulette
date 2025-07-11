import { useMediaQuery } from '@betfinio/components/hooks';
import { toast } from '@betfinio/components/ui';
import { useEffect, useRef } from 'react';
import type { Address } from 'viem';
import { useGetPlayerBets, useRouletteState } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { RouletteResultToast } from '../RouletteResultToast';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { table } = useVisibleTable();
	const { scrollToHeader } = useScrollToHeader();

	const { data: bets = [] } = useGetPlayerBets(table);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const lastShownBet = useRef<Address>(undefined);
	const lastStatus = useRef<typeof status>(undefined);
	useEffect(() => {
		if (status === 'landed' && bets[0].bet.toLowerCase() !== lastShownBet.current?.toLowerCase()) {
			toast(<RouletteResultToast rouletteBet={bets[0]} />, { classNames: { content: 'rl:!w-full' } });

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();
			lastShownBet.current = bets[0].bet;
			lastStatus.current = status;
		}

		if (status === 'spinning' && lastStatus.current !== 'spinning') {
			scrollToHeader();
			lastStatus.current = status;
		}
	}, [wheelStateData]);

	useEffect(() => {
		if (!lastShownBet.current && bets[0]) {
			lastShownBet.current = bets[0].bet;
		}
	}, [bets]);

	if (isVertical) {
		return (
			<div className="rl:relative rl:w-full rl:flex rl:flex-col rl:items-center rl:justify-center rl:p-2 rl:gap-y-2">
				<VerticalRoulette />
			</div>
		);
	}

	if (isTablet) {
		return (
			<div className="rl:relative rl:w-full rl:flex rl:flex-col rl:items-center rl:justify-center rl:gap-y-2">
				<TabletRoulette />
			</div>
		);
	}

	return (
		<div className="rl:relative rl:w-full rl:flex rl:flex-col rl:items-center rl:justify-center rl:gap-y-2">
			<DesktopRoulette />
		</div>
	);
};
