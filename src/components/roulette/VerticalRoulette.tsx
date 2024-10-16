import BetHistory from '../BetHistory/BetHistory';
import TableBet from '../TableBet/TableBet';
import BetStatusHeader from './BetStatusHeader/BetStatusHeader';
import { MainTable } from './MainTable/MainTable';
import { TableRaceTrack } from './TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';

export const VerticalRoulette = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full gap-y-2">
			<div className={'relative w-full mt-2'}>
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
			<TableRaceTrack />
			<div className={' w-[var(--min-width-sm)] flex flex-col gap-y-6 mb-8'}>
				<MainTable />
				<BetHistory />
				<TableBet />
			</div>
		</div>
	);
};
