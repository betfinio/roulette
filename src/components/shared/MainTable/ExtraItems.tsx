import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/shared/query';
import TableItem from '../TableItem';
import { tableExtraConfigHorizontal, tableExtraConfigVertical } from './tableExtraItemsConfig';

export const ExtraItems: FC = () => {
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();
	const extraItems = ['1st', '2nd', '3rd'];
	const { onHoverNumbers, onLeaveHover } = useRouletteNumbersState();
	const { winNumber } = useGetSelectedRound();

	const { isVertical } = useMediaQuery();
	return (
		<>
			{extraItems.map((item) => (
				<TableItem
					key={item}
					number={item}
					isVertical={isVertical}
					{...(isVertical ? tableExtraConfigVertical[item] : tableExtraConfigHorizontal[item])}
					onHoverNumbers={onHoverNumbers}
					onLeaveHover={onLeaveHover}
					winNumber={Number(winNumber)}
					onClick={(position, relatedNumbers) =>
						place({
							item: `${item}-${position}`,
							numbers: relatedNumbers,
						})
					}
					onContextMenu={(position, relatedNumbers) =>
						unplace({
							item: `${item}-${position}`,
							numbers: relatedNumbers,
						})
					}
					className={cn(' rl:bg-card', {
						' rl:rounded-md rl:w-full rl:h-full  rl:box-border': !isVertical,
						' rl:rounded-md rl:w-16 rl:h-10  rl:box-border': isVertical,
					})}
				/>
			))}
		</>
	);
};
