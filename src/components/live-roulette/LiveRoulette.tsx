import { useGetSelectedRound, useLiveRouletteState, useTablePlayerRounds } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { useMediaQuery, useToast } from '@betfinio/components/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { RouletteResultToast } from '../RouletteResultToast';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const LiveRoulette = () => {
	const { isTablet, isVertical } = useMediaQuery();
	const { toast } = useToast();
	const { table } = useVisibleTable();
	const { scrollToHeader } = useScrollToHeader();
	const { round } = useGetSelectedRound();

	const { data: playerRounds, isRefetching } = useTablePlayerRounds(table);

	const { state: wheelStateData, updateState } = useLiveRouletteState();
	const status = wheelStateData.data.state;

	const lastStatus = useRef<typeof status>();

	const selectedRound = useMemo(() => {
		return playerRounds?.find((playerRound) => playerRound.round === round);
	}, [playerRounds, round]);

	useEffect(() => {
		if (status === WheelStatus.JustFinished && selectedRound) {
			toast({
				component: <RouletteResultToast rouletteBet={selectedRound} />,
			});

			const hasWon = selectedRound.winAmount > 0n;
			hasWon && shootConfetti();

			lastStatus.current = status;

			updateState({
				state: WheelStatus.Finished,
			});
		}

		if (status === WheelStatus.Requested && lastStatus.current !== status) {
			scrollToHeader();
			lastStatus.current = status;
		}
	}, [status, isRefetching, selectedRound]);

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
