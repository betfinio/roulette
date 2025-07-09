import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { type FC, Fragment } from 'react';
import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { getGridNumbers } from '@/src/lib/roulette';
import { useGetDebugMode, usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/shared/query';
import TableItem from '../TableItem';
import { tableConfigHorizontal } from './tableConfigHorizontal';
import { tableConfigVertical } from './tableConfigVertical';

export const RouletteNumbersGrid: FC = () => {
	const { isVertical } = useMediaQuery();
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();
	const { isNumberHovered, isNumberSelected, onHoverNumbers, onLeaveHover } = useRouletteNumbersState();
	const { data: isDebugMode } = useGetDebugMode();
	const { winNumber } = useGetSelectedRound();

	const numbers = getGridNumbers(isVertical);

	const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;

	return (
		<Fragment>
			{numbers.map((item) => (
				<TableItem
					key={item}
					number={item}
					isVertical={isVertical}
					{...tableConfig[item]}
					winNumber={Number(winNumber)}
					onHoverNumbers={onHoverNumbers}
					onLeaveHover={onLeaveHover}
					className={cn(`${tableConfig[item]?.className} rl:border-transparent rl:border-[3px] rl:outline-transparent rl:transition-all `, {
						'rl:border-bonus/80 ': isNumberHovered(+item) && !isDebugMode,
						'rl:border-muted/50 ': !isNumberHovered(+item) && isDebugMode,
						'rl:border-white/80! rl:border-[3px] rl:animate-[pulse_2s_ease-in-out_infinite] rl:z-10': Number(winNumber) === Number(item),
						'rl:border-primary/80': isNumberSelected(+item),
						'rl:aspect-square': !isVertical,
					})}
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
				/>
			))}
		</Fragment>
	);
};
