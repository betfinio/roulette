import { useMemo } from 'react';
import { useGetSelectedRound, useGetTableSelectedRoundBets } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useVisibleTable } from '@/src/lib/shared/query';
import { BetItem } from './BetTabItem';

export const BetsTab = () => {
	const { table } = useVisibleTable();
	const { round = 0, isRoundFinished, roundStatus, roundStatusProps, currentRoundProps } = useGetSelectedRound();
	const { data = [] } = useGetTableSelectedRoundBets(table, round);

	const computedRoundBets = useMemo(() => {
		if (isRoundFinished && roundStatus !== undefined && [WheelStatus.Refunded, WheelStatus.Finished].includes(roundStatus)) {
			return data.sort((a, b) => {
				return Number(b.winAmount) - Number(a.winAmount);
			});
		}

		return data;
	}, [isRoundFinished, data, roundStatus]);
	if (currentRoundProps.isFetching || roundStatusProps.isFetching || roundStatus === undefined) {
		return;
	}

	return (
		<div className="rl:flex rl:flex-col rl:gap-2">
			{computedRoundBets.map((bet, index) => {
				return (
					<BetItem
						key={bet.bet}
						bet={bet}
						round={round}
						index={index}
						showWinnders={isRoundFinished && [WheelStatus.Refunded, WheelStatus.Finished].includes(roundStatus)}
					/>
				);
			})}
		</div>
	);
};
