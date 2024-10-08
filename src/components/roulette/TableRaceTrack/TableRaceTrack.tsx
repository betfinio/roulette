import { cn } from '@/lib/utils';
import miniTableImg from '@/src/assets/images/mini-table.svg';
import { useMediaQuery } from '@/src/lib/roulette/query';
import Racetrack from './Racetrack';

export const TableRaceTrack = () => {
	const { isVertical } = useMediaQuery();
	return (
		<div
			className={cn('w-full  flex items-center justify-between', {
				'max-w-sm': isVertical,
				'max-w-[--max-w-global]': !isVertical,
			})}
		>
			{!isVertical && <Racetrack />}

			{isVertical && <img src={miniTableImg} alt="Mini Table" className="h-12" />}
		</div>
	);
};
