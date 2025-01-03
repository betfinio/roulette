import { useGetTableRounds } from '@/src/lib/live-roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useGetTableAddress, useRouletteState, useScrollToHeader } from '@/src/lib/shared/query';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useRef } from 'react';
import type { Address } from 'viem';
import { RouletteResultToast } from '../RouletteResultToast';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const LiveRoulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { tableAddress } = useGetTableAddress();
	const { scrollToHeader } = useScrollToHeader();

	const { data: bets = [], isRefetching } = useGetTableRounds(50, tableAddress);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const lastShownRound = useRef<number>(-1);
	const lastStatus = useRef<typeof status>();

	useEffect(() => {
		if (status === 'landed' && !isRefetching && bets[0]?.round !== lastShownRound.current) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();

			lastShownRound.current = bets[0].round;
			lastStatus.current = status;
		}

		if (status === 'spinning' && lastStatus.current === 'spinning') {
			scrollToHeader();
			lastStatus.current = status;
		}
	}, [status, isRefetching]);

	useEffect(() => {
		if (!lastShownRound.current && bets[0]) {
			lastShownRound.current = bets[0].round;
		}
	}, [bets]);

	if (isVertical) {
		return (
			<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
				<VerticalRoulette />
			</div>
		);
	}

	if (isTablet) {
		return (
			<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
				<TabletRoulette />
			</div>
		);
	}

	return (
		<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
			<DesktopRoulette />
		</div>
	);
};
