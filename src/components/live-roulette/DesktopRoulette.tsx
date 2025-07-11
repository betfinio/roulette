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
		<div className="flex flex-col justify-between w-full grow mx-auto p-4 2xl:pr-0  gap-y-4">
			{/* Conteúdo Principal no Desktop */}
			<div className="flex gap-4">
				<div className="relative flex-1 flex flex-col w-full ">
					<div>
						<div className="relative">
							<BetStatusHeader />
						</div>
						<div className="relative overflow-hidden ">
							<div className="absolute inset-0 bg-linear-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
							<div className="relative w-full h-full mx-auto flex items-start gap-4 ">
								{/* <ResultHistory /> */}
								<div className="flex flex-col gap-4 relative z-50">
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
				<div className="relative flex flex-col gap-4">
					<BetDetails />

					<Totals />
				</div>
			</div>
			<div>
				<div className="mx-auto max-w-5xl flex w-full">
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
