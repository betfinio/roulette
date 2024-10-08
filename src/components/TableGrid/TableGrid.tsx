import type React from 'react';
import { useState } from 'react';
import './TableGrid.css';
import { getBlack, getRed } from '@/src/lib/roulette';
import { useWheel } from '../../contexts/WheelContext';
import BetControls from './BetControls';
import TableItem from './TableItem';
import { tableConfigHorizontal } from './tableConfigHorizontal';
import { tableConfigVertical } from './tableConfigVertical';

const getNumbers = (isVertical: boolean): string[] => {
	if (isVertical) {
		return Array.from({ length: 36 }, (_, index) => (index + 1).toString());
	}
	return [
		'3',
		'6',
		'9',
		'12',
		'15',
		'18',
		'21',
		'24',
		'27',
		'30',
		'33',
		'36',
		'2',
		'5',
		'8',
		'11',
		'14',
		'17',
		'20',
		'23',
		'26',
		'29',
		'32',
		'35',
		'1',
		'4',
		'7',
		'10',
		'13',
		'16',
		'19',
		'22',
		'25',
		'28',
		'31',
		'34',
	];
};

const getCenterSelectionForExtraItem = (index: number, isVertical: boolean): number[] => {
	const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);

	if (isVertical) {
		if (index === 0) {
			return numbersVertical.filter((n) => (n - 1) % 3 === 0);
		}
		if (index === 1) {
			return numbersVertical.filter((n) => (n - 2) % 3 === 0);
		}
		return numbersVertical.filter((n) => n % 3 === 0);
	}
	if (index === 0) {
		return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
	}
	if (index === 1) {
		return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
	}
	return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
};

const TableGrid: React.FC = () => {
	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);
	const { placeChip, isDebugMode, placedChips, isAmerican, isVertical } = useWheel();

	const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;
	const numbers = getNumbers(isVertical);
	const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);
	const handleLeaveHover = () => setHoveredNumbers([]);
	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);
	const getPlacedChipsForNumber = (number: number | string) => placedChips.filter((chip) => chip.number === number);

	const ZeroItem: React.FC = () => {
		const zeroClassName = isAmerican
			? `zero-${isVertical ? 'v' : 'h'} zero-american-${isVertical ? 'v' : 'h'}`
			: `zero-${isVertical ? 'v' : 'h'} zero-european-${isVertical ? 'v' : 'h'}`;

		if (isAmerican) {
			return (
				<div className={`zero-american-wrapper-${isVertical ? 'v' : 'h'}`}>
					{['0', '00'].map((zero) => (
						<TableItem
							isZero
							key={zero}
							number={zero}
							centerSelection={[0]}
							isVertical={isVertical}
							className={`grid-item-${isVertical ? 'v' : 'h'} ${zeroClassName} ${
								isNumberHovered(0) && !isDebugMode ? 'grid-item-highlighted' : ''
							} ${isDebugMode && 'grid-item-debug'}`}
							onHoverNumbers={handleHoverNumbers}
							onLeaveHover={handleLeaveHover}
							onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
						/>
					))}
				</div>
			);
		}
		return (
			<TableItem
				isZero
				key={0}
				number={'0'}
				centerSelection={[0]}
				isVertical={isVertical}
				className={`grid-item-${isVertical ? 'v' : 'h'} ${zeroClassName} ${
					isNumberHovered(0) && !isDebugMode ? 'grid-item-highlighted' : ''
				} ${isDebugMode && 'grid-item-debug'}`}
				onHoverNumbers={handleHoverNumbers}
				onLeaveHover={handleLeaveHover}
				onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
			/>
		);
	};

	const SideTable: React.FC = () => {
		const sideItemsConfig = {
			'1 to 18': {
				centerSelection: numbersVertical.slice(0, 18),
				className: 'common-square',
			},
			Even: {
				centerSelection: numbersVertical.filter((n) => n % 2 === 0),
				className: 'common-square',
			},
			Red: {
				centerSelection: getRed(),
				className: 'red-square',
			},
			Black: {
				centerSelection: getBlack(),
				className: 'black-square',
			},
			Odd: {
				centerSelection: numbersVertical.filter((n) => n % 2 !== 0),
				className: 'common-square',
			},
			'19 to 36': {
				centerSelection: numbersVertical.slice(18, 36),
				className: 'common-square',
			},
		};

		const dozenItemsConfig = {
			'1 to 12': {
				centerSelection: numbersVertical.slice(0, 12),
				className: 'common-square',
			},

			'13 to 24': {
				centerSelection: numbersVertical.slice(12, 24),
				className: 'common-square',
			},

			'25 to 36': {
				centerSelection: numbersVertical.slice(24, 36),
				className: 'common-square',
			},
		};

		return (
			<>
				<div className={`side-table-container-${isVertical ? 'v' : 'h'} side-items-dozen`}>
					{(Object.keys(sideItemsConfig) as unknown as Array<keyof typeof sideItemsConfig>).map((key) => (
						<TableItem
							key={key}
							number={key}
							isVertical={isVertical}
							isRangeButton
							centerSelection={sideItemsConfig[key].centerSelection}
							onHoverNumbers={handleHoverNumbers}
							onLeaveHover={handleLeaveHover}
							onClick={(position, relatedNumbers) => placeChip(key, position, sideItemsConfig[key].centerSelection)}
							className={`side-item-${isVertical ? 'v row-span-2' : 'h col-span-1'} ${sideItemsConfig[key].className}`}
						/>
					))}
				</div>
				<div className={`side-table-container-${isVertical ? 'v' : 'h'} side-items-main`}>
					{(Object.keys(dozenItemsConfig) as unknown as Array<keyof typeof dozenItemsConfig>).map((key) => (
						<TableItem
							key={key}
							number={key}
							isVertical={isVertical}
							isRangeButton
							centerSelection={dozenItemsConfig[key].centerSelection}
							onHoverNumbers={handleHoverNumbers}
							onLeaveHover={handleLeaveHover}
							onClick={(position, relatedNumbers) => placeChip(key, position, dozenItemsConfig[key].centerSelection)}
							className={`side-item-${isVertical ? 'v row-span-4' : 'h col-span-2'} ${dozenItemsConfig[key].className}`}
						/>
					))}
				</div>
			</>
		);
	};

	const MainGrid: React.FC = () => {
		return (
			<>
				<ZeroItem />
				{numbers.map((item) => (
					<TableItem
						key={item}
						number={item}
						isVertical={isVertical}
						{...tableConfig[item]}
						onHoverNumbers={handleHoverNumbers}
						onLeaveHover={handleLeaveHover}
						className={`${tableConfig[item]?.className} ${isNumberHovered(+item) ? 'grid-item-highlighted' : ''} ${isDebugMode && 'grid-item-debug'}`}
						onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
					/>
				))}
			</>
		);
	};

	const ExtraItems: React.FC = () => {
		const extraItems = ['1st', '2nd', '3rd'];
		return (
			<div className={`grid-container-lanes-${isVertical ? 'v' : 'h'}`}>
				{extraItems.map((item, index) => (
					<TableItem
						key={item}
						number={item}
						isVertical={isVertical}
						centerSelection={getCenterSelectionForExtraItem(index, isVertical)}
						onHoverNumbers={handleHoverNumbers}
						onLeaveHover={handleLeaveHover}
						onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
						className={`grid-item-${isVertical ? 'v' : 'h'} common-square`}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center gap-y-2">
			<div className={`table-container-${isVertical ? 'v' : 'h'}`}>
				<div className={`table-container-${isVertical ? 'v' : 'h'}`}>
					{isVertical ? (
						<>
							<div className={'side-table-main-v'}>
								<SideTable />
							</div>
							<div className={'grid-container-wrapper-v'}>
								<div className={'grid-container-v'}>
									<MainGrid />
								</div>
								<ExtraItems />
							</div>
						</>
					) : (
						<>
							<div className={'grid-container-wrapper-h'}>
								<div className={'grid-container-h'}>
									<MainGrid />
								</div>
								<ExtraItems />
							</div>
							<div className={'side-table-main-h px-14'}>
								<SideTable />
							</div>
						</>
					)}
				</div>
			</div>
			<BetControls />
		</div>
	);
};

export default TableGrid;
