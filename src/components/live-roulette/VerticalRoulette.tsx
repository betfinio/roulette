import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import BetStatusHeader from '../shared/BetStatusHeader/BetStatusHeader';
import { MainTable } from '../shared/MainTable/MainTable';
import { BetDetails } from './BetDetails/BetDetails';
import { Totals } from './BetDetails/Totals';
import History from './History/HistoryTable';
import Wheel from './Wheel/Wheel';

export const VerticalRoulette = () => {
	const { isRoundFinished } = useGetSelectedRound();

	return (
		<div className="rl:flex rl:flex-col rl:items-center rl:justify-center rl:w-full rl:p-2 rl:gap-y-2">
			<div className={'rl:relative rl:w-full '}>
				<div className="rl:relative">
					<BetStatusHeader />
				</div>
				<div className="rl:relative rl:overflow-hidden">
					<div className="rl:absolute rl:inset-0 rl:bg-linear-to-b rl:from-gradientDarkStart rl:via-gradientDarkMid rl:to-gradientDarkEnd rl:z-10 rl:pointer-events-none" />
					<div className={'rl:relative rl:w-full rl:h-full rl:mx-auto rl:flex max-w-sm'}>
						<Wheel />
					</div>
				</div>
			</div>

			<div className={'rl:w-full rl:flex rl:flex-col rl:gap-y-6 rl:mb-8'}>
				<MainTable hideBetControls={isRoundFinished} />
				<div className="rl:relative  ">
					<BetDetails />
					<div className="  rl:mt-2">
						<Totals />
					</div>
				</div>

				<History />
			</div>
		</div>
	);
};
