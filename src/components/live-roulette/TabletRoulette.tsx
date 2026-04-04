import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import { MainTable } from '../shared/MainTable/MainTable';
import { BetDetails } from './BetDetails/BetDetails';
import { Totals } from './BetDetails/Totals';
import History from './History/HistoryTable';
import { LastResults } from './LastResults/LastResults';
import { TableStat } from './TableStat';
import Wheel from './Wheel/Wheel';

export const TabletRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	return (
		<div className="flex flex-col justify-between w-full grow mx-auto p-3">
			<div className="relative flex-1 flex flex-col w-full ">
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className="relative w-full h-full mx-auto flex items-start gap-4">
						<div className="flex flex-col gap-2 relative z-50">
							<LastResults />
						</div>
						<Wheel />
						<TableStat />
					</div>
				</div>

				<div className="mx-auto max-w-5xl flex w-full">
					<MainTable hideBetControls={isRoundFinished} showLiveSettle />
				</div>
			</div>
			<div className="relative  mt-4">
				<BetDetails />
			</div>
			<div className="  mt-4">
				<Totals />
			</div>
			<div className=" shrink-0 mt-4">
				<History />
			</div>
		</div>
	);
};
