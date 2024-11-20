import { useMediaQuery, useRouletteBets, useRouletteState } from '@/src/lib/roulette/query';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { ZeroAddress } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'betfinio_app/use-toast';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { RouletteResultToast } from '../RouletteResultToast';
import { BET_STATUS_HEADER } from './BetStatusHeader/BetStatusHeader';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { address = ZeroAddress } = useAccount();
	const { toast } = useToast();
	const { data: bets = [], isRefetching } = useRouletteBets(address);

	const { state: wheelStateData, updateState } = useRouletteState();
	const status = wheelStateData.data.state;

	const [lastShownBet, setLastShownBet] = useState<string>('');

	useEffect(() => {
		if (status === 'landed' && !isRefetching && bets[0].hash !== lastShownBet) {
			toast({
				component: <RouletteResultToast rouletteBet={bets[0]} />,
			});

			const hasWon = bets[0].amount < bets[0].result;
			hasWon && shootConfetti();

			setLastShownBet(bets[0].hash || '');
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
