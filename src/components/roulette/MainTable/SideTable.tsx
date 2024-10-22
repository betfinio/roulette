import { getBlack, getRed, numbersVertical } from '@/src/lib/roulette';
import { useMediaQuery, usePlace, useRouletteNumbersState } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../TableItem';

const sideItemsConfig = {
	'1 to 18': {
		centerSelection: numbersVertical.slice(0, 18),
		className: 'bg-card',
	},
	Even: {
		centerSelection: numbersVertical.filter((n) => n % 2 === 0),
		className: 'bg-card',
	},
	Red: {
		centerSelection: getRed(),
		className: 'bg-red-roulette',
	},
	Black: {
		centerSelection: getBlack(),
		className: 'bg-black-roulette',
	},
	Odd: {
		centerSelection: numbersVertical.filter((n) => n % 2 !== 0),
		className: 'bg-card',
	},
	'19 to 36': {
		centerSelection: numbersVertical.slice(18, 36),
		className: 'bg-card',
	},
};

const dozenItemsConfig = {
	'1 to 12': {
		centerSelection: numbersVertical.slice(0, 12),
		className: 'bg-card',
	},

	'13 to 24': {
		centerSelection: numbersVertical.slice(12, 24),
		className: 'bg-card',
	},

	'25 to 36': {
		centerSelection: numbersVertical.slice(24, 36),
		className: 'bg-card',
	},
};

export const SideTable: FC = () => {
	const { mutate: place } = usePlace();
	const { onHoverNumbers, onLeaveHover } = useRouletteNumbersState();

	const { isVertical } = useMediaQuery();
	return (
		<>
			<div
				className={cn(`side-table-container-${isVertical ? 'v' : 'h'} side-items-dozen`, {
					'grid grid-rows-[repeat(12,40px)] grid-cols-1 justify-center items-center gap-1 h-fit order-1': isVertical,
					'grid grid-cols-6 grid-rows-1 justify-center items-center gap-1 h-fit order-2': !isVertical,
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
						onClick={(position, relatedNumbers) =>
							place({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						className={cn(` ${sideItemsConfig[key].className}`, {
							' rounded-md w-10 h-full border border-border row-span-2 ': isVertical,
							'  rounded-md w-full h-[55px] border border-border col-span-1': !isVertical,
						})}
					/>
				))}
			</div>
			<div
				className={cn(`side-table-container-${isVertical ? 'v' : 'h'} side-items-main`, {
					'grid grid-rows-[repeat(12,40px)] grid-cols-1 justify-center items-center gap-1 h-fit order-2': isVertical,
					'grid grid-cols-6 grid-rows-1 justify-center items-center gap-1 h-fit order-1': !isVertical,
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
						onClick={(position, relatedNumbers) =>
							place({
								item: `${key}-${position}`,
								numbers: relatedNumbers,
							})
						}
						className={cn(` ${dozenItemsConfig[key].className}`, {
							' rounded-md w-10 h-full border border-border row-span-4': isVertical,
							'  rounded-md w-full h-[55px] border border-border col-span-2': !isVertical,
						})}
					/>
				))}
			</div>
		</>
	);
};
