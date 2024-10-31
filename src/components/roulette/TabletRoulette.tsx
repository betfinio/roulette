import { useRouletteState } from '@/src/lib/roulette/query';
import BetStatusHeader from './BetStatusHeader/BetStatusHeader';
import History from './History/HistoryTable';
import { LastResults } from './LastResults/LastResults';
import { MainTable } from './MainTable/MainTable';
import { PlayerStat } from './PlayerStat/PlayerStat';
import { TableRaceTrack } from './TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';

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
						<PlayerStat />
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
