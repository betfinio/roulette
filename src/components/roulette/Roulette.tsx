import { useGetPlayerBets, useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useRef } from 'react';
import type { Address } from 'viem';
import { RouletteResultToast } from '../RouletteResultToast';
import { BET_STATUS_HEADER } from '../shared/BetStatusHeader/BetStatusHeader';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { tableAddress } = useGetTableAddress();

	const { data: bets = [] } = useGetPlayerBets(tableAddress);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const lastShownBet = useRef<Address>();
	useEffect(() => {
		if (status === 'landed' && bets[0].bet.toLowerCase() !== lastShownBet.current?.toLowerCase()) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();
			lastShownBet.current = bets[0].bet;
		}
		if (status === 'spinning') {
			document.getElementById(BET_STATUS_HEADER)?.scrollIntoView({
				behavior: 'smooth',
			});
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
