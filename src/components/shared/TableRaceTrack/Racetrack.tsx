import { cn } from '@betfinio/components';
import type React from 'react';
import { useState } from 'react';
import { getColor } from '@/src/lib/roulette';
import { usePlace } from '@/src/lib/shared/query';
import TableItem from '../TableItem';
import { LeftCorner } from './LeftCorner';
import { RightCorner } from './RightCorner';
import { racetrackConfig } from './racetrackConfig';

interface RacetrackProps {
	onPlace?: () => void;
}
const Racetrack: React.FC<RacetrackProps> = ({ onPlace }) => {
	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);

	const { mutateAsync: place } = usePlace();

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);
	const handleLeaveHover = () => setHoveredNumbers([]);
	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);

	// Numbers on the racetrack
	const numbersTop = [24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35];
	const numbersBottom = [30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
	const numbersLeft = [5, 10, 23, 8];
	const numbersRight = [3, 26, 0];

	return (
		<div className="rl:w-full rl:h-32 rl:flex rl:items-center rl:justify-start">
			{/* Left Corner */}

			<LeftCorner numbersLeft={numbersLeft} hoveredNumbers={hoveredNumbers} />
			{/* Central Tracks */}
			<div className="rl:flex rl:flex-col ">
				{/* Top numbers */}
				<div className="rl:flex rl:justify-center rl:mx-1 gap-x-1">
					{numbersTop.map((num) => (
						<div
							key={num}
							className={cn(
								'rl:w-7 rl:h-7  rl:outline-transparent rl:transition-all rl:duration-300 rl:outline-2  rl:flex rl:items-center rl:justify-center rl:text-xs rl:rounded-md ',
								{
									'rl:outline-bonus': isNumberHovered(num),
									'rl:bg-red-roulette': getColor(num) === 'RED',
									'rl:bg-black-roulette': getColor(num) === 'BLACK',
									'rl:bg-green-roulette': getColor(num) === 'GREEN',
								},
							)}
						>
							{num}
						</div>
					))}
				</div>
				{/* Central area with labels */}
				<div className="rl:relative rl:w-full rl:flex rl:items-center rl:justify-center">
					{/* Labels */}
					<div className="rl:w-full rl:flex rl:items-center rl:justify-between rl:gap-4 rl:z-10 rl:py-2 rl:pl-8">
						{Object.keys(racetrackConfig).map((strategy) => (
							<TableItem
								key={strategy}
								number={strategy}
								isVertical={false}
								isRangeButton={true}
								centerSelection={racetrackConfig[strategy].relatedNumbers}
								onHoverNumbers={handleHoverNumbers}
								onLeaveHover={handleLeaveHover}
								onClick={(position: string, relatedNumbers: number[]) => {
									relatedNumbers.forEach(async (number) => {
										await place({
											numbers: [number],
											item: `${number}-${position}`,
										});
									});
									onPlace?.();
								}}
								className={'rl:border-none rl:w-fit rl:relative rl:h-4 rl:cursor-pointer'}
							/>
						))}
					</div>

					{/* SVG lines */}

					<svg
						className="rl:absolute rl:w-full rl:h-auto rl:z-0 rl:text-foreground"
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
				<div className="rl:flex rl:justify-center gap-x-1">
					{numbersBottom.map((num) => (
						<div
							key={num}
							className={cn(
								'rl:w-[28px] rl:h-[28px]   rl:outline-transparent rl:transition-all rl:duration-300 rl:outline-2  rl:flex rl:items-center rl:justify-center rl:text-xs rl:rounded-md ',
								{
									'rl:outline-bonus': isNumberHovered(num),
									'rl:bg-red-roulette': getColor(num) === 'RED',
									'rl:bg-black-roulette': getColor(num) === 'BLACK',
									'rl:bg-green-roulette': getColor(num) === 'GREEN',
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
