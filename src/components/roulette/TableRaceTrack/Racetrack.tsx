import { getColor } from '@/src/lib/roulette';
import { usePlace } from '@/src/lib/roulette/query';
import { cn } from '@betfinio/components';
import type React from 'react';
import { useState } from 'react';
import TableItem from '../TableItem';
import { LeftCorner } from './LeftCorner';
import { RightCorner } from './RightCorner';
import { racetrackConfig } from './racetrackConfig';

const Racetrack: React.FC = () => {
	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);

	const { mutate: place } = usePlace();

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);
	const handleLeaveHover = () => setHoveredNumbers([]);
	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);

	// Numbers on the racetrack
	const numbersTop = [24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35];
	const numbersBottom = [30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
	const numbersLeft = [5, 10, 23, 8];
	const numbersRight = [3, 26, 0];

	return (
		<div className="w-full h-32 flex items-center justify-start">
			{/* Left Corner */}

			<LeftCorner numbersLeft={numbersLeft} hoveredNumbers={hoveredNumbers} />
			{/* Central Tracks */}
			<div className="flex flex-col ">
				{/* Top numbers */}
				<div className="flex justify-center mx-1 gap-x-1">
					{numbersTop.map((num) => (
						<div
							key={num}
							className={cn(
								'w-7 h-7  outline outline-transparent transition-all duration-300 outline-2  flex items-center justify-center text-xs rounded-md ',
								{
									'outline-bonus': isNumberHovered(num),
									'bg-red-roulette': getColor(num) === 'RED',
									'bg-black-roulette': getColor(num) === 'BLACK',
									'bg-green-roulette': getColor(num) === 'GREEN',
								},
							)}
						>
							{num}
						</div>
					))}
				</div>
				{/* Central area with labels */}
				<div className="relative w-full flex items-center justify-center">
					{/* Labels */}
					<div className="w-full flex items-center justify-between gap-4 z-10 py-2 pl-8">
						{Object.keys(racetrackConfig).map((strategy) => (
							<TableItem
								key={strategy}
								number={strategy}
								isVertical={false}
								isRangeButton={true}
								centerSelection={racetrackConfig[strategy].relatedNumbers}
								onHoverNumbers={handleHoverNumbers}
								onLeaveHover={handleLeaveHover}
								onClick={(position: string, relatedNumbers: number[], number) => {
									relatedNumbers.forEach((number) => {
										place({
											numbers: [number],
											item: `${number}-${position}`,
										});
									});
								}}
								className={'!border-none w-fit relative   h-4 cursor-pointer'}
							/>
						))}
					</div>

					{/* SVG lines */}

					<svg
						className="absolute w-full h-auto z-0 text-foreground"
						width="475"
						height="31"
						viewBox="0 0 475 31"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line x1="94.2122" y1="0.547271" x2="158.212" y2="30.5473" stroke="currentColor" />
						<line x1="253.798" y1="1" x2="253.798" y2="31" stroke="currentColor" />
						<line x1="413.5" y1="1" x2="413.5" y2="31" stroke="currentColor" />
					</svg>
				</div>
				{/* Bottom numbers */}
				<div className="flex justify-center gap-x-1">
					{numbersBottom.map((num) => (
						<div
							key={num}
							className={cn(
								'w-[28px] h-[28px]  outline outline-transparent transition-all duration-300 outline-2  flex items-center justify-center text-xs rounded-md ',
								{
									'outline-bonus': isNumberHovered(num),
									'bg-red-roulette': getColor(num) === 'RED',
									'bg-black-roulette': getColor(num) === 'BLACK',
									'bg-green-roulette': getColor(num) === 'GREEN',
								},
							)}
						>
							{num}
						</div>
					))}
				</div>
			</div>

			{/* Right Corner */}

			<RightCorner numbersRight={numbersRight} hoveredNumbers={hoveredNumbers} />
		</div>
	);
};

export default Racetrack;
