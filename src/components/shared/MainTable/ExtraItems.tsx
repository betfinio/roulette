import { usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/roulette/query';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import TableItem from '../TableItem';
import { tableExtraConfigHorizontal, tableExtraConfigVertical } from './tableExtraItemsConfig';

export const ExtraItems: FC = () => {
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();
	const extraItems = ['1st', '2nd', '3rd'];
	const { onHoverNumbers, onLeaveHover } = useRouletteNumbersState();

	const { isVertical } = useMediaQuery();
	return (
		<>
			{extraItems.map((item, index) => (
				<TableItem
					key={item}
					number={item}
					isVertical={isVertical}
					{...(isVertical ? tableExtraConfigVertical[item] : tableExtraConfigHorizontal[item])}
					onHoverNumbers={onHoverNumbers}
					onLeaveHover={onLeaveHover}
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
					className={cn(' bg-card', {
						' rounded-md w-full h-full  box-border': !isVertical,
						' rounded-md w-16 h-10  box-border': isVertical,
					})}
				/>
			))}
		</>
	);
};
