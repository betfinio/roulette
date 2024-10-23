import { cn } from '@/lib/utils';
import { useRouletteState } from '@/src/lib/roulette/query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PageNavigation from '../PageNavigation/PageNavigation';
import BetStatusHeader from './BetStatusHeader/BetStatusHeader';
import History from './History/HistoryTable';
import { LastResults } from './LastResults/LastResults';
import { MainTable } from './MainTable/MainTable';
import { PlayerStat } from './PlayerStat/PlayerStat';
import { TableRaceTrack } from './TableRaceTrack/TableRaceTrack';
import Wheel from './Wheel/Wheel';

export const TabletRoulette = () => {
	const [currentPage, setCurrentPage] = useState(1);

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;

	useEffect(() => {
		if (status === 'spinning') {
			setCurrentPage(1);
		}
	}, [status]);

	console.log(status, 'status');

	// Define motion variants for the animations
	const pageTransition = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -50 },
	};

	return (
		<div className="relative w-full p-2">
			<div className="mx-auto">
				<PageNavigation currentPage={currentPage} totalPages={3} setCurrentPage={setCurrentPage} />
			</div>

			{/* Page 1 - Bet Status, Wheel and Player Stat */}
			<motion.div
				variants={pageTransition}
				initial={currentPage === 1 ? 'hidden' : false} // Only animate when the page becomes visible
				animate={currentPage === 1 ? 'visible' : 'hidden'} // Control visibility with the page state
				transition={{ duration: 0.3 }}
				className={cn('relative flex-1 flex flex-col w-full mt-2 mx-auto', {
					hidden: currentPage !== 1,
				})}
				style={{ display: currentPage === 1 ? 'block' : 'none' }} // Ensure pages persist in the DOM
			>
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
			</motion.div>

			{/* Page 2 - Table Race Track and Main Table */}
			<motion.div
				variants={pageTransition}
				initial={currentPage === 2 ? 'hidden' : false}
				animate={currentPage === 2 ? 'visible' : 'hidden'}
				transition={{ duration: 0.3 }}
				className={cn('relative flex-1 flex flex-col w-full mt-2 mx-auto', {
					hidden: currentPage !== 2,
				})}
				style={{ display: currentPage === 2 ? 'block' : 'none' }}
			>
				<BetStatusHeader />
				<TableRaceTrack />
				<MainTable />
			</motion.div>

			{/* Page 3 - History */}
			<motion.div
				variants={pageTransition}
				initial={currentPage === 3 ? 'hidden' : false}
				animate={currentPage === 3 ? 'visible' : 'hidden'}
				transition={{ duration: 0.3 }}
				className={cn('relative flex-1 flex flex-col w-full mt-2 mx-auto', {
					hidden: currentPage !== 3,
				})}
				style={{ display: currentPage === 3 ? 'block' : 'none' }}
			>
				<BetStatusHeader />
				<div className="w-full mt-6 max-w-6xl">
					<History />
				</div>
			</motion.div>
		</div>
	);
};
