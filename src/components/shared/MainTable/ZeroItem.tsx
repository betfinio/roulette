import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { useGetDebugMode, usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/shared/query';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import TableItem from '../TableItem';

export const ZeroItem: FC = () => {
	const { isVertical } = useMediaQuery();
	const zeroClassName = isVertical ? 'col-span-3 h-10' : 'h-full'; // `zero-${isVertical ? "v" : "h"} zero-european-${isVertical ? "v" : "h"}`;
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();

	const { data: isDebugMode } = useGetDebugMode();

	const { isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover } = useRouletteNumbersState();
	const { winNumber } = useGetSelectedRound();

	return (
		<TableItem
			isZero
			key={0}
			number={'0'}
			centerSelection={[0]}
			isVertical={isVertical}
			winNumber={Number(winNumber)}
			className={cn(
				`bg-green-roulette w-full ${zeroClassName} border-[3px] border-transparent transition-all duration-300`,

				{
					'border-bonus': isNumberHovered(0) && !isDebugMode,
					'border-muted/50 ': !isNumberHovered(0) && isDebugMode,
					'border-primary': isNumberSelected(0),
					'border-white/80! border-[3px] animate-[pulse_2s_ease-in-out_infinite] z-10': Number(winNumber) === Number(0),
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
