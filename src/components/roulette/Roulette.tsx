import { useGetPlayerBets, useRouletteState } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useState } from 'react';
import { RouletteResultToast } from '../RouletteResultToast';
import { BET_STATUS_HEADER } from './BetStatusHeader/BetStatusHeader';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { data: bets = [], isRefetching } = useGetPlayerBets();

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	const [lastShownBet, setLastShownBet] = useState<string>('');

	useEffect(() => {
		console.log(isRefetching, 'isRefetching');
		console.log(status, 'status');
		if (status === 'landed' && !isRefetching && bets[0].transactionHash !== lastShownBet) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].winAmount;
			hasWon && shootConfetti();

			setLastShownBet(bets[0].transactionHash || '');
		}

		if (status === 'spinning') {
			document.getElementById(BET_STATUS_HEADER)?.scrollIntoView({
				behavior: 'smooth',
			});
		}
	}, [status, isRefetching]);

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
