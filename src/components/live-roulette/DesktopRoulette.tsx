import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';

import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import { BetDetails } from './BetDetails/BetDetails';
import { LastResults } from './LastResults/LastResults';
import { TableStat } from './TableStat';

import Wheel from './Wheel/Wheel';

export const DesktopRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	console.log('DesktopRoulette');
	return (
		<div className="flex flex-col justify-between w-full flex-grow mx-auto p-4 gap-y-4">
			{/* Conteúdo Principal no Desktop */}
			<div className="flex gap-4">
				<div className="relative flex-1 flex flex-col w-full ">
					<div>
						<div className="relative">
							<BetStatusHeader />
						</div>
						<div className="relative overflow-hidden ">
							<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
							<div className="relative w-full h-full mx-auto flex items-start gap-4 ">
								{/* <ResultHistory /> */}

								<LastResults />
								<Wheel />
								<TableStat />
							</div>
						</div>
						{/* <TableRaceTrack/> */}

						{!isRoundFinished && <TableRaceTrack />}
					</div>
				</div>
				<div className="relative  ">
					<BetDetails />
				</div>
			</div>
			<div>
				<div className="mx-auto max-w-5xl flex w-full">
					<MainTable hideBetControls={isRoundFinished} />
				</div>
			</div>

			{/* BetHistory ao lado direito do conteúdo principal */}
			<div className=" flex-shrink-0 mt-4">
				<History />
			</div>
		</div>
	);
};
