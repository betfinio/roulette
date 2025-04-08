import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';

export const VerticalRoulette = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full gap-y-2">
			<div className={'relative w-full'}>
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className={'relative w-full h-full mx-auto flex max-w-sm'}>
						<Wheel />
					</div>
				</div>
			</div>
			<TableRaceTrack />
			<div className={' w-full flex flex-col gap-y-6 mb-8'}>
				<MainTable />

				<History />
			</div>
		</div>
	);
};
