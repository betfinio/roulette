import { useState } from 'react';
import BetHistory from '../BetHistory/BetHistory';
import PageNavigation from '../PageNavigation/PageNavigation';
import TableBet from '../TableBet/TableBet';
import BetStatusHeader from './BetStatusHeader/BetStatusHeader';
import { LastResults } from './LastResults/LastResults';
import { MainTable } from './MainTable/MainTable';
import { PlayerStat } from './PlayerStat/PlayerStat';
import { TableRaceTrack } from './TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';
export const TabletRoulette = () => {
	const [currentPage, setCurrentPage] = useState(1);
	return (
		<div className="relative w-full  p-2">
			<div className=" mx-auto">
				<PageNavigation currentPage={currentPage} totalPages={3} setCurrentPage={setCurrentPage} />
			</div>
			{currentPage === 1 && (
				<div className="relative flex-1 flex flex-col w-full mt-2  mx-auto">
					<div className="relative">
						<BetStatusHeader />
					</div>
					<div className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
						<div className="relative w-full h-full mx-auto flex items-start">
							<LastResults />
							<Wheel />
							<PlayerStat />
						</div>
					</div>
				</div>
			)}

			{currentPage === 2 && (
				<div className="relative flex-1 flex flex-col w-full mt-2  mx-auto">
					<BetStatusHeader />
					<TableRaceTrack />
					<MainTable />
				</div>
			)}

			{currentPage === 3 && (
				<div className="relative flex-1 flex flex-col w-full mt-2  mx-auto">
					<BetStatusHeader />
					<div className="w-full mt-6 max-w-6xl">
						<TableBet />
					</div>
				</div>
			)}
		</div>
	);
};
