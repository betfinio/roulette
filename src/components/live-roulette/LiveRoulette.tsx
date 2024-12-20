import { useGetPlayerBets, useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useState } from 'react';
import { RouletteResultToast } from '../RouletteResultToast';
import { BET_STATUS_HEADER } from '../shared/BetStatusHeader/BetStatusHeader';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const LiveRoulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { tableAddress } = useGetTableAddress();
	const { data: bets = [], isRefetching } = useGetPlayerBets(tableAddress);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const [lastShownBet, setLastShownBet] = useState<string>('');

	useEffect(() => {
		if (status === 'landed' && !isRefetching && bets[0].bet !== lastShownBet) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();

			setLastShownBet(bets[0].bet || '');
		}

		if (status === 'spinning') {
			document.getElementById(BET_STATUS_HEADER)?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [status, isRefetching]);

	useEffect(() => {
		if (!lastShownBet && bets[0]) {
			setLastShownBet(bets[0].bet);
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
