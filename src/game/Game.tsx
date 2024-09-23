import miniTableImg from '../assets/images/mini-table.svg';
import BetHistory from '../components/BetHistory/BetHistory';
import BetStatusHeader from '../components/BetStatusHeader/BetStatusHeader';
import TableBet from '../components/TableBet/TableBet';
import TableGrid from '../components/TableGrid/TableGrid';
import CoinRainEffect from '../components/Wheel/CoinRainEffect';
import Wheel from '../components/Wheel/Wheel';

export const Game = () => {
	return (
		<div className="flex flex-col items-center justify-center w-full gap-y-2">
			<div className="relative w-full mt-2">
				<div className="relative">
					<BetStatusHeader />
				</div>
				<div className="relative mt-betstatus-offset h-wheel-height overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-gradientDarkStart via-gradientDarkMid to-gradientDarkEnd z-10 pointer-events-none" />
					<div className="relative h-full z-0">
						<Wheel />
					</div>
				</div>
			</div>
			<div className="w-[var(--min-width-sm)] flex items-center justify-between">
				<div className="flex items-center space-x-2 text-sm">
					<span>See my bets</span>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" className="sr-only peer" />
						<div className="w-10 h-5 bg-primaryDark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--yellow)] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--yellow)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-[#151A2A] dark:border-[1px] peer-checked:bg-[var(--yellow)]" />
					</label>
					<span>All bets</span>
				</div>
				<img src={miniTableImg} alt="Mini Table" className="h-12" />
			</div>
			<div className="w-[var(--min-width-sm)] flex flex-col gap-y-6 mb-8">
				<TableGrid />
				<BetHistory />
				<TableBet />
			</div>
			<CoinRainEffect />
		</div>
	);
};

export default Game;
