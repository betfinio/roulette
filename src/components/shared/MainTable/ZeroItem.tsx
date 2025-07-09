import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { useGetDebugMode, usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/shared/query';
import TableItem from '../TableItem';

export const ZeroItem: FC = () => {
	const { isVertical } = useMediaQuery();
	const zeroClassName = isVertical ? 'rl:col-span-3 rl:h-10' : 'rl:h-full'; // `zero-${isVertical ? "v" : "h"} zero-european-${isVertical ? "v" : "h"}`;
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
				`rl:bg-green-roulette rl:w-full ${zeroClassName} rl:border-[3px] rl:border-transparent rl:transition-all rl:duration-300`,

				{
					'rl:border-bonus': isNumberHovered(0) && !isDebugMode,
					'rl:border-muted/50 ': !isNumberHovered(0) && isDebugMode,
					'rl:border-primary': isNumberSelected(0),
					'rl:border-white/80! rl:border-[3px] rl:animate-[pulse_2s_ease-in-out_infinite] rl:z-10': Number(winNumber) === Number(0),
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
