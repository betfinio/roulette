import { useLocalBets, useMediaQuery } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import { useState } from 'react';
import { BetControls } from '../BetControls/BetControls';
import { ExtraItems } from './ExtraItems';
import { RouletteNumbersGrid } from './RouletteNumbersGrid';
import { SideTable } from './SideTable';
import { ZeroItem } from './ZeroItem';

export const MainTable = () => {
	const { isVertical } = useMediaQuery();
	const { data: bets = [] } = useLocalBets();

	const selected = bets.flatMap((e) => e.numbers);
	const isNumberSelected = (number: number) => selected.includes(number);

	console.log(isVertical, 'isVertical');

	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);
	const handleLeaveHover = () => setHoveredNumbers([]);

	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);

	if (isVertical) {
		return (
			<div className="flex flex-col items-center gap-y-2">
				<div className={'flex gap-x-5 items-center justify-center'}>
					<div className={'flex gap-x-5 items-center justify-center'}>
						<div className={'grid grid-cols-2 gap-1 h-fit'}>
							<SideTable onHoverNumbers={handleHoverNumbers} onLeaveHover={handleLeaveHover} />
						</div>
						<div className={'  flex flex-col gap-y-1 items-center justify-center'}>
							<div className={'grid grid-cols-[repeat(3,64px)] gap-1 justify-center items-center  '}>
								<RouletteNumbersGrid
									onHoverNumbers={handleHoverNumbers}
									onLeaveHover={handleLeaveHover}
									isNumberHovered={isNumberHovered}
									isNumberSelected={isNumberSelected}
								/>
							</div>
							<div className="flex gap-1">
								<ExtraItems onHoverNumbers={handleHoverNumbers} onLeaveHover={handleLeaveHover} />
							</div>
						</div>
					</div>
				</div>
				<BetControls />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-y-2">
			<div className={'flex gap-x-1 items-center justify-center w-full'}>
				<div className="grid grid-cols-[repeat(14,1fr)] gap-1 justify-center items-center w-full">
					<ZeroItem isNumberSelected={isNumberSelected} isNumberHovered={isNumberHovered} onHoverNumbers={handleHoverNumbers} onLeaveHover={handleLeaveHover} />

					<div className="col-span-12 grid grid-cols-[repeat(12,1fr)] gap-1">
						<RouletteNumbersGrid
							onHoverNumbers={handleHoverNumbers}
							onLeaveHover={handleLeaveHover}
							isNumberHovered={isNumberHovered}
							isNumberSelected={isNumberSelected}
						/>
					</div>
					{/* ExtraItems occupying the 14th column */}
					<div className="col-span-1 grid grid-cols-[repeat(1,1fr)] gap-1 h-full">
						{/* Adjust row span as necessary */}
						<ExtraItems onHoverNumbers={handleHoverNumbers} onLeaveHover={handleLeaveHover} />
					</div>
					<div className="col-span-1" />
					<div className=" col-span-12 grid grid-rows-2 gap-1">
						<SideTable onHoverNumbers={handleHoverNumbers} onLeaveHover={handleLeaveHover} />
					</div>
				</div>
			</div>

			<BetControls />
		</div>
	);
};
