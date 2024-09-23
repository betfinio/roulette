import type React from 'react';
import { useState } from 'react';
import './TableGrid.css';
import { useWheel } from '../../contexts/WheelContext';
import BetControls from './BetControls';
import TableItem from './TableItem';
import { tableConfig } from './tableConfig';

const TableGrid: React.FC = () => {
	const [isAmerican, setIsAmerican] = useState(false);
	const [isVertical, setIsVertical] = useState(true);
	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);
	const { placeChip, isDebugMode, getChipColor, placedChips } = useWheel();

	const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);
	const numbersHorizontal = [
		3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34,
	];

	const numbers = isVertical ? numbersVertical : numbersHorizontal;
	const extraItems = ['1st', '2nd', '3rd'];

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);

	const handleLeaveHover = () => setHoveredNumbers([]);

	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);

	const getPlacedChipsForNumber = (number: number | string) => {
		return placedChips.filter((chip) => chip.number === number);
	};

	return (
		<div className="flex flex-col items-center mt-4 gap-y-8">
			<div className={`${isVertical ? 'table-container-v' : 'table-container-h'}`}>
				{isVertical ? (
					<div className="table-container-v">
						<div className="side-table-main-v">
							<div className="side-table-container-v">
								<TableItem
									number="1 to 18"
									isRangeButton
									centerSelection={numbersVertical.slice(0, 18)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('1 to 18')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('1 to 18', position, numbersVertical.slice(0, 18))}
									className={`side-item-v row-span-2 common-square-v ${isDebugMode && isNumberHovered(1) ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="Even"
									isRangeButton
									centerSelection={numbersVertical.filter((n) => n % 2 === 0)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('Even')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) =>
										placeChip(
											'Even',
											position,
											numbersVertical.filter((n) => n % 2 === 0),
										)
									}
									className={`side-item-v row-span-2 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="Red"
									isRangeButton
									centerSelection={tableConfig.redNumbers}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('Red')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('Red', position, tableConfig.redNumbers)}
									className={`side-item-v row-span-2 red-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="Black"
									isRangeButton
									centerSelection={tableConfig.blackNumbers}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('Black')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('Black', position, tableConfig.blackNumbers)}
									className={`side-item-v row-span-2 black-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="Odd"
									isRangeButton
									centerSelection={numbersVertical.filter((n) => n % 2 !== 0)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('Odd')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) =>
										placeChip(
											'Odd',
											position,
											numbersVertical.filter((n) => n % 2 !== 0),
										)
									}
									className={`side-item-v row-span-2 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="19 to 36"
									isRangeButton
									centerSelection={numbersVertical.slice(18, 36)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('19 to 36')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('19 to 36', position, numbersVertical.slice(18, 36))}
									className={`side-item-v row-span-2 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
							</div>
							<div className="side-table-container-v">
								<TableItem
									number="1 to 12"
									isRangeButton
									centerSelection={numbersVertical.slice(0, 12)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('1 to 12')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('1 to 12', position, numbersVertical.slice(0, 12))}
									className={`side-item-v row-span-4 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="13 to 24"
									isRangeButton
									centerSelection={numbersVertical.slice(12, 24)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('13 to 24')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('13 to 24', position, numbersVertical.slice(12, 24))}
									className={`side-item-v row-span-4 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
								<TableItem
									number="25 to 36"
									isRangeButton
									centerSelection={numbersVertical.slice(24, 36)}
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isDebugMode={isDebugMode}
									placedChips={getPlacedChipsForNumber('25 to 36')}
									getChipColor={getChipColor}
									onClick={(position, relatedNumbers) => placeChip('25 to 36', position, numbersVertical.slice(24, 36))}
									className={`side-item-v row-span-4 common-square-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
								/>
							</div>
						</div>
						<div className="grid-container-wrapper-v">
							<div className="grid-container-v">
								{isAmerican ? (
									<div className="zero-american-wrapper-v">
										<TableItem
											key={0}
											number={'0'}
											centerSelection={[0]}
											placedChips={getPlacedChipsForNumber(0)}
											className={`grid-item-v zero-v zero-american-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
											onHoverNumbers={handleHoverNumbers}
											onLeaveHover={handleLeaveHover}
											isDebugMode={isDebugMode}
											getChipColor={getChipColor}
											onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
										/>
										<TableItem
											key={'00'}
											number={'00'}
											centerSelection={[0]}
											placedChips={getPlacedChipsForNumber('00')}
											className={`grid-item-v zero-v zero-american-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
											onHoverNumbers={handleHoverNumbers}
											onLeaveHover={handleLeaveHover}
											isDebugMode={isDebugMode}
											getChipColor={getChipColor}
											onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
										/>
									</div>
								) : (
									<TableItem
										key={0}
										number={0}
										centerSelection={[0]}
										placedChips={getPlacedChipsForNumber(0)}
										className={`grid-item-v zero-v zero-european-v ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										isDebugMode={isDebugMode}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
									/>
								)}
								{numbers.map((item) => (
									<TableItem
										key={item}
										number={item}
										{...tableConfig[item]}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										className={`${tableConfig[item]?.className} ${isNumberHovered(item) ? 'highlighted' : ''}`}
										isDebugMode={isDebugMode}
										placedChips={getPlacedChipsForNumber(item)}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
									/>
								))}
							</div>
							<div className="grid-container-lanes-v">
								{extraItems.map((item, index) => (
									<TableItem
										key={item}
										number={item}
										centerSelection={
											index === 0
												? numbersVertical.filter((n) => (n - 1) % 3 === 0)
												: index === 1
													? numbersVertical.filter((n) => (n - 2) % 3 === 0)
													: numbersVertical.filter((n) => n % 3 === 0)
										}
										placedChips={getPlacedChipsForNumber(item)}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										isDebugMode={isDebugMode}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
										className="grid-item-v common-square-v"
									/>
								))}
							</div>
						</div>
					</div>
				) : (
					<div className="table-container-h">
						<div className="grid-container-wrapper-h">
							<div className="grid-container-h">
								{isAmerican ? (
									<div className="zero-american-wrapper-h">
										<TableItem
											key={0}
											number={'0'}
											centerSelection={[0]}
											placedChips={getPlacedChipsForNumber(0)}
											className={`grid-item-h zero-h zero-american-h ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
											onHoverNumbers={handleHoverNumbers}
											onLeaveHover={handleLeaveHover}
											isDebugMode={isDebugMode}
											getChipColor={getChipColor}
											onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
										/>
										<TableItem
											key={'00'}
											number={'00'}
											centerSelection={[0]}
											placedChips={getPlacedChipsForNumber('00')}
											className={`grid-item-h zero-h zero-american-h ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
											onHoverNumbers={handleHoverNumbers}
											onLeaveHover={handleLeaveHover}
											isDebugMode={isDebugMode}
											getChipColor={getChipColor}
											onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
										/>
									</div>
								) : (
									<TableItem
										key={0}
										number={0}
										centerSelection={[0]}
										placedChips={getPlacedChipsForNumber(0)}
										className={`grid-item-h zero-h zero-european-h ${isNumberHovered(0) && !isDebugMode ? 'highlighted' : ''}`}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										isDebugMode={isDebugMode}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(0, position, relatedNumbers)}
									/>
								)}
								{numbers.map((item) => (
									<TableItem
										key={item}
										number={item}
										{...tableConfig[item]}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										className={`${tableConfig[item]?.className} ${isNumberHovered(item) ? 'highlighted' : ''}`}
										isDebugMode={isDebugMode}
										placedChips={getPlacedChipsForNumber(item)}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
									/>
								))}
							</div>
							<div className="grid-container-lanes-h">
								{extraItems.map((item, index) => (
									<TableItem
										key={item}
										number={item}
										centerSelection={
											index === 0
												? numbersVertical.filter((n) => (n - 1) % 3 === 0)
												: index === 1
													? numbersVertical.filter((n) => (n - 2) % 3 === 0)
													: numbersVertical.filter((n) => n % 3 === 0)
										}
										placedChips={getPlacedChipsForNumber(item)}
										onHoverNumbers={handleHoverNumbers}
										onLeaveHover={handleLeaveHover}
										isDebugMode={isDebugMode}
										getChipColor={getChipColor}
										onClick={(position, relatedNumbers) => placeChip(item, position, relatedNumbers)}
										className="grid-item-h common-square-h"
									/>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
			<BetControls />
		</div>
	);
};

export default TableGrid;
