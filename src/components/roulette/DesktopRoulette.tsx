import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import { LastResults } from './LastResults/LastResults';
import { PlayerStat } from './PlayerStat';
import Wheel from './Wheel/Wheel';

export const DesktopRoulette = () => {
	return (
		<div className="rl:flex rl:flex-col rl:justify-between rl:w-full rl:grow rl:mx-auto rl:p-4">
			{/* Conteúdo Principal no Desktop */}
			<div className="rl:relative rl:flex-1 rl:flex rl:flex-col rl:w-full ">
				<div className="rl:relative">
					<BetStatusHeader />
				</div>
				<div className="rl:relative rl:overflow-hidden">
					<div className="rl:absolute rl:inset-0 rl:bg-linear-to-b rl:from-gradientDarkStart rl:via-gradientDarkMid rl:to-gradientDarkEnd rl:z-10 rl:pointer-events-none" />
					<div className="rl:relative rl:w-full rl:h-full rl:mx-auto rl:flex rl:items-start rl:gap-4">
						<div className="rl:flex rl:flex-col rl:gap-4">
							<LastResults />
							{/* <TableRaceTrack/> */}
							<TableRaceTrack />
						</div>
						{/* <ResultHistory /> */}

						<Wheel />
						<PlayerStat />
					</div>
				</div>

				<div className="rl:mx-auto rl:max-w-5xl rl:flex rl:w-full">
					<MainTable />
				</div>
			</div>

			{/* BetHistory ao lado direito do conteúdo principal */}
			<div className=" rl:shrink-0 rl:mt-4">
				<History />
			</div>
		</div>
	);
};
