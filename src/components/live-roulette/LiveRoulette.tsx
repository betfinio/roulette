import { useMediaQuery } from '@betfinio/components/hooks';
import { useEffect } from 'react';
import { useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const LiveRoulette = () => {
	const { isTablet, isVertical } = useMediaQuery();

	const { state: wheelStateData, updateState } = useLiveRouletteState();
	const status = wheelStateData.data.state;

	useEffect(() => {
		if (status === WheelStatus.JustFinished) updateState({ state: WheelStatus.Finished });
	}, [status, updateState]);

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
