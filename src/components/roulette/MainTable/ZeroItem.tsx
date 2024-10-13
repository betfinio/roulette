import { useGetDebugMode, useMediaQuery, usePlace } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../../TableGrid/TableItem';

interface IZeroItemProps {
	isNumberHovered: (number: number) => boolean;
	onHoverNumbers: (numbers: number[]) => void;
	onLeaveHover: () => void;
	isNumberSelected: (number: number) => boolean;
}
export const ZeroItem: FC<IZeroItemProps> = ({ isNumberHovered, onHoverNumbers, onLeaveHover, isNumberSelected }) => {
	const { isVertical } = useMediaQuery();
	const zeroClassName = isVertical ? 'col-span-3 h-10' : 'h-full'; // `zero-${isVertical ? "v" : "h"} zero-european-${isVertical ? "v" : "h"}`;
	const { mutate: place } = usePlace();

	const { data: isDebugMode } = useGetDebugMode();

	return (
		<TableItem
			isZero
			key={0}
			number={'0'}
			centerSelection={[0]}
			isVertical={isVertical}
			className={cn(
				`bg-green-roulette w-full ${zeroClassName} outline outline-4 outline-transparent transition-all duration-300 delay-100`,

				{
					' outline-green-roulette ': isNumberHovered(0) && !isDebugMode,
					' outline-muted/50 ': !isNumberHovered(0) && isDebugMode,
					'outline-accent-secondary-foreground': isNumberSelected(0),
				},
			)}
			onHoverNumbers={onHoverNumbers}
			onLeaveHover={onLeaveHover}
			onClick={(position, relatedNumbers) =>
				place({
					item: `${0}-${position}`,
					numbers: relatedNumbers,
				})
			}
		/>
	);
};
