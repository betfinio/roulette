import Wheel from '../roulette/Wheel/Wheel';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import { LastResults } from './LastResults/LastResults';
import { TableStat } from './TableStat';

export const TabletRoulette = () => {
	return (
		<div className="flex flex-col justify-between w-full flex-grow mx-auto p-4">
			{/* Conteúdo Principal no Desktop */}
			<div className="relative flex-1 flex flex-col w-full ">
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className="relative w-full h-full mx-auto flex items-start gap-4">
						{/* <ResultHistory /> */}
						<LastResults />
						<Wheel />
						<TableStat />
					</div>
				</div>

				{/* <TableRaceTrack/> */}
				<TableRaceTrack />
				<div className="mx-auto max-w-5xl flex w-full">
					<MainTable />
				</div>
			</div>

			{/* BetHistory ao lado direito do conteúdo principal */}
			<div className=" flex-shrink-0 mt-4">
				<History />
			</div>
		</div>
	);
};
