import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { getBlack, getRed, numbersVertical } from '@/src/lib/roulette';
import { usePlace, useRouletteNumbersState, useUnplace } from '@/src/lib/shared/query';
import TableItem from '../TableItem';

export const sideItemsConfig = {
	'1 to 18': {
		centerSelection: numbersVertical.slice(0, 18),
		className: 'rl:bg-card',
	},
	Even: {
		centerSelection: numbersVertical.filter((n) => n % 2 === 0),
		className: 'rl:bg-card',
	},
	Red: {
		centerSelection: getRed(),
		className: 'rl:bg-red-roulette',
	},
	Black: {
		centerSelection: getBlack(),
		className: 'rl:bg-black-roulette',
	},
	Odd: {
		centerSelection: numbersVertical.filter((n) => n % 2 !== 0),
		className: 'rl:bg-card',
	},
	'19 to 36': {
		centerSelection: numbersVertical.slice(18, 36),
		className: 'rl:bg-card',
	},
};

export const dozenItemsConfig = {
	'1 to 12': {
		centerSelection: numbersVertical.slice(0, 12),
		className: 'rl:bg-card',
	},

	'13 to 24': {
		centerSelection: numbersVertical.slice(12, 24),
		className: 'rl:bg-card',
	},

	'25 to 36': {
		centerSelection: numbersVertical.slice(24, 36),
		className: 'rl:bg-card',
	},
};

export const SideTable: FC = () => {
	const { mutate: place } = usePlace();
	const { mutate: unplace } = useUnplace();
	const { onHoverNumbers, onLeaveHover } = useRouletteNumbersState();
	const { winNumber } = useGetSelectedRound();

	const { isVertical } = useMediaQuery();
	return (
		<>
			<div
				className={cn(`side-table-container-${isVertical ? 'v' : 'h'} side-items-dozen`, {
					'rl:grid rl:grid-rows-[repeat(12,40px)] rl:grid-cols-1 rl:justify-center rl:items-center rl:gap-1 rl:h-fit rl:order-1': isVertical,
					'rl:grid rl:grid-cols-6 rl:grid-rows-1 rl:justify-center rl:items-center rl:gap-1 rl:h-fit rl:order-2': !isVertical,
				})}
			>
				{(Object.keys(sideItemsConfig) as unknown as Array<keyof typeof sideItemsConfig>).map((key) => (
					<TableItem
						key={key}
						number={key}
						isVertical={isVertical}
						isRangeButton
						centerSelection={sideItemsConfig[key].centerSelection}
						onHoverNumbers={onHoverNumbers}
						onLeaveHover={onLeaveHover}
						winNumber={Number(winNumber)}
						onClick={(position, relatedNumbers) =>
							place({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						onContextMenu={(position, relatedNumbers) =>
							unplace({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						className={cn(` ${sideItemsConfig[key].className}`, {
							' rl:rounded-md rl:w-10 rl:h-full rl:border rl:border-border rl:row-span-2 ': isVertical,
							'  rl:rounded-md rl:w-full rl:h-[55px] rl:border rl:border-border rl:col-span-1': !isVertical,
						})}
					/>
				))}
			</div>
			<div
				className={cn(`side-table-container-${isVertical ? 'v' : 'h'} side-items-main`, {
					'rl:grid rl:grid-rows-[repeat(12,40px)] rl:grid-cols-1 rl:justify-center rl:items-center rl:gap-1 rl:h-fit rl:order-2': isVertical,
					'rl:grid rl:grid-cols-6 rl:grid-rows-1 rl:justify-center rl:items-center rl:gap-1 rl:h-fit rl:order-1': !isVertical,
				})}
			>
				{(Object.keys(dozenItemsConfig) as unknown as Array<keyof typeof dozenItemsConfig>).map((key) => (
					<TableItem
						key={key}
						number={key}
						isVertical={isVertical}
						isRangeButton
						centerSelection={dozenItemsConfig[key].centerSelection}
						onHoverNumbers={onHoverNumbers}
						onLeaveHover={onLeaveHover}
						winNumber={Number(winNumber)}
						onClick={(position, relatedNumbers) =>
							place({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						onContextMenu={(position, relatedNumbers) =>
							unplace({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						className={cn(` ${dozenItemsConfig[key].className}`, {
							' rl:rounded-md rl:w-10 rl:h-full rl:border rl:border-border rl:row-span-4': isVertical,
							'  rl:rounded-md rl:w-full rl:h-[55px] rl:border rl:border-border rl:col-span-2': !isVertical,
						})}
					/>
				))}
			</div>
		</>
	);
};
