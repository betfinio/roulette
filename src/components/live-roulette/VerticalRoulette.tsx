import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import { BetDetails } from './BetDetails/BetDetails';
import { Totals } from './BetDetails/Totals';
import History from './History/HistoryTable';
import Wheel from './Wheel/Wheel';

export const VerticalRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	return (
		<div className="flex flex-col items-center justify-center w-full p-2 gap-y-2">
			<div className={'relative w-full '}>
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className={'relative w-full h-full mx-auto flex max-w-sm'}>
						<Wheel />
					</div>
				</div>
			</div>

			<div className={'w-full flex flex-col gap-y-6 mb-8'}>
				<MainTable hideBetControls={isRoundFinished} />
				<div className="relative  ">
					<BetDetails />
					<div className="  mt-2">
						<Totals />
					</div>
				</div>

				<History />
			</div>
		</div>
	);
};
