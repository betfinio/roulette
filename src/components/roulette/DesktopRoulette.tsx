import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import History from '../shared/HistoryTable';
import { MainTable } from '../shared/MainTable/MainTable';
import { LastResults } from './LastResults/LastResults';
import { PlayerStat } from './PlayerStat';
import Wheel from './Wheel/Wheel';

export const DesktopRoulette = () => {
	return (
		<div className="flex flex-col justify-between w-full grow mx-auto py-4">
			<div className="relative flex-1 flex flex-col w-full ">
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className="relative w-full h-full mx-auto flex items-start gap-4">
						<LastResults />
						<Wheel />
						<PlayerStat />
					</div>
				</div>

				<div className="mx-auto max-w-5xl flex w-full">
					<MainTable />
				</div>
			</div>
			<div className=" shrink-0 mt-4">
				<History />
			</div>
		</div>
	);
};
