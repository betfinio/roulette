import { useGetDebugMode, useMediaQuery, usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../TableItem';

export const ZeroItem: FC = () => {
	const { isVertical } = useMediaQuery();
	const zeroClassName = isVertical ? 'col-span-3 h-10' : 'h-full'; // `zero-${isVertical ? "v" : "h"} zero-european-${isVertical ? "v" : "h"}`;
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();

	const { data: isDebugMode } = useGetDebugMode();

	const { isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover } = useRouletteNumbersState();

	return (
		<TableItem
			isZero
			key={0}
			number={'0'}
			centerSelection={[0]}
			isVertical={isVertical}
			className={cn(
				`bg-green-roulette w-full ${zeroClassName}  border-4 border-transparent transition-all duration-300`,

				{
					'border-bonus': isNumberHovered(0) && !isDebugMode,
					'border-muted/50 ': !isNumberHovered(0) && isDebugMode,
					'border-accent-secondary-foreground': isNumberSelected(0),
				},
			)}
			onHoverNumbers={onHoverNumbers}
			onLeaveHover={onLeaveHover}
			onContextMenu={(position, relatedNumbers) =>
				unplace({
					item: `${0}-${position}`,
					numbers: relatedNumbers,
				})
			}
			onClick={(position, relatedNumbers) =>
				place({
					item: `${0}-${position}`,
					numbers: relatedNumbers,
				})
			}
		/>
	);
};
