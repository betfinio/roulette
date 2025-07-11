import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';

export const VerticalRoulette = () => {
	return (
		<div className="rl:flex rl:flex-col rl:items-center rl:justify-center rl:w-full rl:gap-y-2">
			<div className={'rl:relative rl:w-full'}>
				<div className="rl:relative">
					<BetStatusHeader />
				</div>
				<div className="rl:relative rl:overflow-hidden">
					<div className="rl:absolute rl:inset-0 rl:bg-linear-to-b rl:from-gradientDarkStart rl:via-gradientDarkMid rl:to-gradientDarkEnd rl:z-10 rl:pointer-events-none" />
					<div className={'rl:relative rl:w-full rl:h-full rl:mx-auto rl:flex rl:max-w-sm'}>
						<Wheel />
					</div>
				</div>
			</div>
			<TableRaceTrack />
			<div className={' rl:w-full rl:flex rl:flex-col rl:gap-y-6 rl:mb-8'}>
				<MainTable />

				<History />
			</div>
		</div>
	);
};
