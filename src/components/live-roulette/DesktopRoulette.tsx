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

export const DesktopRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	return (
		<div className="rl:flex rl:flex-col rl:justify-between rl:w-full grow rl:mx-auto rl:p-4 2xl:pr-0  rl:gap-y-4  ">
			{/* Conteúdo Principal no Desktop */}
			<div className="rl:flex rl:gap-4">
				<div className="rl:relative rl:flex-1 rl:flex rl:flex-col rl:w-full ">
					<div>
						<div className="relative">
							<BetStatusHeader />
						</div>
						<div className="rl:relative rl:overflow-hidden ">
							<div className="rl:absolute rl:inset-0 rl:bg-linear-to-b rl:from-gradientDarkStart rl:via-gradientDarkMid rl:to-gradientDarkEnd rl:z-10 rl:pointer-events-none" />
							<div className="rl:relative rl:w-full rl:h-full rl:mx-auto rl:flex rl:items-start rl:gap-4 ">
								{/* <ResultHistory /> */}
								<div className="rl:flex rl:flex-col rl:gap-4 rl:relative rl:z-50">
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
					</div>
				</div>
				<div className="rl:relative rl:flex rl:flex-col gap-4">
					<BetDetails />

					<Totals />
				</div>
			</div>
			<div>
				<div className="rl:mx-auto rl:max-w-5xl rl:flex w-full">
					<MainTable hideBetControls={isRoundFinished} />
				</div>
			</div>

			{/* BetHistory ao lado direito do conteúdo principal */}
			<div className=" shrink-0 mt-4">
				<History />
			</div>
		</div>
	);
};
