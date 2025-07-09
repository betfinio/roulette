import { motion } from 'motion/react';
import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import { MainTable } from '../shared/MainTable/MainTable';
import { TableRaceTrack } from '../shared/TableRaceTrack/TableRaceTrack';
import { BetDetails } from './BetDetails/BetDetails';
import { Totals } from './BetDetails/Totals';
import History from './History/HistoryTable';
import { LastResults } from './LastResults/LastResults';
import { TableStat } from './TableStat';
import Wheel from './Wheel/Wheel';

export const TabletRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	return (
		<div className="rl:flex rl:flex-col rl:justify-between rl:w-full rl:grow rl:mx-auto p-3">
			{/* Conteúdo Principal no Desktop */}
			<div className="rl:relative rl:flex-1 rl:flex rl:flex-col rl:w-full ">
				<div className="rl:relative">
					<BetStatusHeader />
				</div>
				<div className="rl:relative rl:overflow-hidden">
					<div className="rl:absolute rl:inset-0 rl:bg-linear-to-b rl:from-gradientDarkStart rl:via-gradientDarkMid rl:to-gradientDarkEnd rl:z-10 rl:pointer-events-none" />
					<div className="rl:relative rl:w-full rl:h-full rl:mx-auto rl:flex rl:items-start rl:gap-4">
						<div className="rl:flex rl:flex-col rl:gap-2 rl:relative rl:z-50">
							{/* <ResultHistory /> */}
							<LastResults />
							{!isRoundFinished && (
								<motion.div initial={{ opacity: 0, x: '-50%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 2 }}>
									<TableRaceTrack />
								</motion.div>
							)}
						</div>
						<Wheel />
						<TableStat />
					</div>
				</div>

				<div className="rl:mx-auto rl:max-w-5xl rl:flex rl:w-full">
					<MainTable hideBetControls={isRoundFinished} />
				</div>
			</div>
			<div className="rl:relative  rl:mt-4">
				<BetDetails />
			</div>
			<div className=" rl:mt-4">
				<Totals />
			</div>

			{/* BetHistory ao lado direito do conteúdo principal */}
			<div className=" rl:shrink-0 rl:mt-4">
				<History />
			</div>
		</div>
	);
};
