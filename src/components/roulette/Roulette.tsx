import { useGetPlayerBets } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useGetTableAddress, useRouletteState, useScrollToHeader } from '@/src/lib/shared/query';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useRef } from 'react';
import type { Address } from 'viem';
import { RouletteResultToast } from '../RouletteResultToast';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { tableAddress } = useGetTableAddress();
	const { scrollToHeader } = useScrollToHeader();

	const { data: bets = [] } = useGetPlayerBets(tableAddress);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const lastShownBet = useRef<Address>();
	const lastStatus = useRef<typeof status>();
	useEffect(() => {
		if (status === 'landed' && bets[0].bet.toLowerCase() !== lastShownBet.current?.toLowerCase()) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();
			lastShownBet.current = bets[0].bet;
			lastStatus.current = status;
		}
		if (status === 'spinning' && lastStatus.current === 'spinning') {
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
