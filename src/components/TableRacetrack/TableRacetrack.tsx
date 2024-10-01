import { useWheel } from '@/src/contexts/WheelContext';
import miniTableImg from '../../assets/images/mini-table.svg';
import Racetrack from './Racetrack';

export const TableRacetrack = () => {
	const { isVertical } = useWheel();
	return (
		<div className={`w-full ${isVertical ? 'max-w-sm' : 'max-w-[--max-w-global]'} flex items-center justify-between`}>
			{!isVertical && <Racetrack />}
			<div className="flex items-center space-x-2 text-sm w-md text-nowrap">
				<span>See my bets</span>
				<label className="relative inline-flex items-center cursor-pointer">
					<input type="checkbox" className="sr-only peer" />
					<div className="w-10 h-5 bg-primaryDark peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--yellow)] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--yellow)] after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-default dark:border-[#151A2A] dark:border-default peer-checked:bg-[var(--yellow)] bg-[var(--bg-sec)]" />
				</label>
				<span>All bets</span>
			</div>
			{isVertical && <img src={miniTableImg} alt="Mini Table" className="h-12" />}
		</div>
	);
};
