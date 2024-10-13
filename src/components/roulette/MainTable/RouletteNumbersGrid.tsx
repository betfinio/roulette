import { getGridNumbers } from '@/src/lib/roulette';
import { useGetDebugMode, useLocalBets, useMediaQuery, usePlace } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../../TableGrid/TableItem';
import { ZeroItem } from './ZeroItem';
import { tableConfigHorizontal } from './tableConfigHorizontal';
import { tableConfigVertical } from './tableConfigVertical';

interface IRouletteNumbersGridProps {
	onHoverNumbers: (numbers: number[]) => void;
	onLeaveHover: () => void;
	isNumberHovered: (number: number) => boolean;
	isNumberSelected: (number: number) => boolean;
}
export const RouletteNumbersGrid: FC<IRouletteNumbersGridProps> = ({ onHoverNumbers, onLeaveHover, isNumberHovered, isNumberSelected }) => {
	const { isVertical } = useMediaQuery();
	const { mutate: place } = usePlace();

	const { data: isDebugMode } = useGetDebugMode();

	const numbers = getGridNumbers(isVertical);

	const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;

	return (
		<>
			{numbers.map((item) => (
				<TableItem
					key={item}
					number={item}
					isVertical={isVertical}
					{...tableConfig[item]}
					onHoverNumbers={onHoverNumbers}
					onLeaveHover={onLeaveHover}
					className={cn(`${tableConfig[item]?.className} outline outline-4 outline-transparent transition-all duration-300 delay-100`, {
						'outline outline-green-roulette ': isNumberHovered(+item) && !isDebugMode,
						'outline outline-muted/50 ': !isNumberHovered(+item) && isDebugMode,
						'outline-accent-secondary-foreground': isNumberSelected(+item),
						' aspect-square': !isVertical,
					})}
					onClick={(position, relatedNumbers) =>
						place({
							item: `${item}-${position}`,
							numbers: relatedNumbers,
						})
					}
				/>
			))}
		</>
	);
};
