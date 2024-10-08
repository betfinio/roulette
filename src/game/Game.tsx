import { useState } from 'react';
import BetHistory from '../components/BetHistory/BetHistory';
import PageNavigation from '../components/PageNavigation/PageNavigation';
import ResultHistory from '../components/ResultHistory/ResultHistory';
import StatsDisplay from '../components/StatsDisplay/StatsDisplay';
import TableBet from '../components/TableBet/TableBet';
import TableGrid from '../components/TableGrid/TableGrid';
import CoinRainEffect from '../components/Wheel/CoinRainEffect';
import Wheel from '../components/Wheel/Wheel';
import BetStatusHeader from '../components/roulette/BetStatusHeader/BetStatusHeader';
import { LastResults } from '../components/roulette/LastResults/LastResults';
import { PlayerStat } from '../components/roulette/PlayerStat/PlayerStat';
import { TableRaceTrack } from '../components/roulette/TableRaceTrack/TableRaceTrack';
import { useWheel } from '../contexts/WheelContext';

export const Game = () => {
	const { isVertical, isTablet } = useWheel();
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
			<CoinRainEffect />

			{/* Para Mobile */}
			{isVertical ? (
				<div className="flex flex-col items-center justify-center w-full gap-y-2">
					{/* Conteúdo Principal no Mobile */}
					<div className={`relative w-full mt-2 ${!isVertical && 'max-w-[--max-w-global]'}`}>
						<div className="relative">
							<BetStatusHeader />
						</div>
						<div className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
							<div className={`relative w-full h-full mx-auto flex ${isVertical ? 'max-w-sm' : 'max-w-5xl'}`}>
								{!isVertical && <LastResults />}
								<Wheel />
								{!isVertical && <PlayerStat />}
							</div>
						</div>
					</div>
					<TableRaceTrack />
					<div className={`${isVertical && 'w-[var(--min-width-sm)]'} flex flex-col gap-y-6 mb-8`}>
						<TableGrid />
						<BetHistory />
						<TableBet />
					</div>
				</div>
			) : isTablet ? (
				// Para Tablet - Layout em 3 partes com navegação
				<div className="relative w-full max-w-6xl mt-4">
					{currentPage === 1 && (
						<div className="relative flex-1 flex flex-col w-full mt-2 max-w-[--max-w-global] mx-auto">
							<div className="relative">
								<BetStatusHeader />
							</div>
							<div className="relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
								<div className="relative w-full h-full mx-auto flex max-w-5xl">
									<LastResults />
									<Wheel />
									<PlayerStat />
								</div>
							</div>
						</div>
					)}

					{currentPage === 2 && (
						<div className="relative flex-1 flex flex-col w-full mt-2 max-w-[--max-w-global] mx-auto">
							<BetStatusHeader />
							<TableRaceTrack />
							<TableGrid />
						</div>
					)}

					{currentPage === 3 && (
						<div className="relative flex-1 flex flex-col w-full mt-2 max-w-[--max-w-global] mx-auto">
							<BetStatusHeader />
							<div className="w-full mt-6 max-w-6xl">
								<TableBet />
							</div>
						</div>
					)}
					<div className="max-w-[--max-w-global] mx-auto">
						<PageNavigation currentPage={currentPage} totalPages={3} setCurrentPage={setCurrentPage} />
					</div>
				</div>
			) : (
				// Para Desktop
				<div className="flex justify-between w-full max-w-6xl mx-auto">
					{/* Conteúdo Principal no Desktop */}
					<div className="relative flex-1 flex flex-col w-full mt-2 max-w-[--max-w-global]">
						<div className="relative">
							<BetStatusHeader />
						</div>
						<div className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
							<div className="relative w-full h-full mx-auto flex max-w-5xl">
								{/* <ResultHistory /> */}
								<LastResults />
								<Wheel />
								<PlayerStat />
							</div>
						</div>

						{/* <TableRaceTrack/> */}
						<TableRaceTrack />
						<TableGrid />
					</div>

					{/* BetHistory ao lado direito do conteúdo principal */}
					<div className="ml-4 flex-shrink-0 w-[300px]">
						<BetHistory />
					</div>
				</div>
			)}

			{/* TableBet no Desktop abaixo de tudo */}
			{!isVertical && !isTablet && (
				<div className="w-full mt-6 max-w-6xl">
					<TableBet />
				</div>
			)}
		</div>
	);
};

export default Game;
