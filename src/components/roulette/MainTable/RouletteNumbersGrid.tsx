import { getGridNumbers } from '@/src/lib/roulette';
import { useGetDebugMode, useLocalBets, useMediaQuery, usePlace, useRouletteNumbersState } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../../TableGrid/TableItem';
import { tableConfigHorizontal } from './tableConfigHorizontal';
import { tableConfigVertical } from './tableConfigVertical';

export const RouletteNumbersGrid: FC = () => {
	const { isVertical } = useMediaQuery();
	const { mutate: place } = usePlace();
	const { isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover } = useRouletteNumbersState();
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
					className={cn(`${tableConfig[item]?.className} border-transparent border-4 outline-transparent transition-all duration-300 delay-100`, {
						' border-green-roulette ': isNumberHovered(+item) && !isDebugMode,
						' border-muted/50 ': !isNumberHovered(+item) && isDebugMode,
						'border-accent-secondary-foreground': isNumberSelected(+item),
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