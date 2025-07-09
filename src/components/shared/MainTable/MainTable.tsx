import { useMediaQuery } from '@betfinio/components/hooks';
import type { FC } from 'react';
import { BetControls } from '../BetControls/BetControls';
import { ExtraItems } from './ExtraItems';
import { RouletteNumbersGrid } from './RouletteNumbersGrid';
import { SideTable } from './SideTable';
import { ZeroItem } from './ZeroItem';

interface MainTableProps {
	hideBetControls?: boolean;
}
export const MainTable: FC<MainTableProps> = ({ hideBetControls }) => {
	const { isVertical } = useMediaQuery();

	if (isVertical) {
		return (
			<div className="rl:flex rl:flex-col rl:items-center rl:gap-y-2">
				<div className={'rl:flex rl:gap-x-5 rl:items-center rl:justify-center'}>
					<div className={'rl:flex rl:gap-x-5 rl:items-center rl:justify-center'}>
						<div className={'rl:grid rl:grid-cols-2 rl:gap-1 h-fit'}>
							<SideTable />
						</div>
						<div className={'rl:flex rl:flex-col rl:gap-y-1 rl:items-center rl:justify-center'}>
							<div className={'rl:grid rl:grid-cols-[repeat(3,64px)] rl:gap-1 rl:justify-center rl:items-center  '}>
								<ZeroItem />
								<RouletteNumbersGrid />
							</div>
							<div className="rl:flex rl:gap-1">
								<ExtraItems />
							</div>
						</div>
					</div>
				</div>
				{!hideBetControls && <BetControls />}
			</div>
		);
	}

	return (
		<div className="rl:flex rl:flex-col rl:items-center rl:gap-y-2 rl:w-full">
			<div className={'rl:flex rl:gap-x-1 rl:items-center rl:justify-center rl:w-full'}>
				<div className="rl:grid rl:grid-cols-[repeat(14,1fr)] rl:gap-1 rl:justify-center rl:items-center rl:w-full">
					<ZeroItem />

					<div className="rl:col-span-12 rl:grid rl:grid-cols-[repeat(12,1fr)] rl:gap-1">
						<RouletteNumbersGrid />
					</div>
					{/* ExtraItems occupying the 14th column */}
					<div className="rl:col-span-1 rl:grid rl:grid-cols-[repeat(1,1fr)] rl:gap-1 rl:h-full">
						{/* Adjust row span as necessary */}
						<ExtraItems />
					</div>
					<div className="rl:col-span-1" />
					<div className=" rl:col-span-12 rl:grid rl:grid-rows-2 rl:gap-1">
						<SideTable />
					</div>
				</div>
			</div>

			{!hideBetControls && <BetControls />}
		</div>
	);
};
