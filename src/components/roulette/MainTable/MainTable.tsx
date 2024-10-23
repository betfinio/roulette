import { useMediaQuery } from '@/src/lib/roulette/query';
import { BetControls } from '../BetControls/BetControls';
import { ExtraItems } from './ExtraItems';
import { RouletteNumbersGrid } from './RouletteNumbersGrid';
import { SideTable } from './SideTable';
import { ZeroItem } from './ZeroItem';

export const MainTable = () => {
	const { isVertical } = useMediaQuery();

	if (isVertical) {
		return (
			<div className="flex flex-col items-center gap-y-2">
				<div className={'flex gap-x-5 items-center justify-center'}>
					<div className={'flex gap-x-5 items-center justify-center'}>
						<div className={'grid grid-cols-2 gap-1 h-fit'}>
							<SideTable />
						</div>
						<div className={'  flex flex-col gap-y-1 items-center justify-center'}>
							<div className={'grid grid-cols-[repeat(3,64px)] gap-1 justify-center items-center  '}>
								<ZeroItem />
								<RouletteNumbersGrid />
							</div>
							<div className="flex gap-1">
								<ExtraItems />
							</div>
						</div>
					</div>
				</div>
				<BetControls />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-y-2 w-full">
			<div className={'flex gap-x-1 items-center justify-center w-full'}>
				<div className="grid grid-cols-[repeat(14,1fr)] gap-1 justify-center items-center w-full">
					<ZeroItem />

					<div className="col-span-12 grid grid-cols-[repeat(12,1fr)] gap-1">
						<RouletteNumbersGrid />
					</div>
					{/* ExtraItems occupying the 14th column */}
					<div className="col-span-1 grid grid-cols-[repeat(1,1fr)] gap-1 h-full">
						{/* Adjust row span as necessary */}
						<ExtraItems />
					</div>
					<div className="col-span-1" />
					<div className=" col-span-12 grid grid-rows-2 gap-1">
						<SideTable />
					</div>
				</div>
			</div>

			<BetControls />
		</div>
	);
};
