import { cn } from '@/lib/utils';
import miniTableImg from '@/src/assets/images/mini-table.svg';
import { useMediaQuery } from '@/src/lib/roulette/query';
import { Button } from 'betfinio_app/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Racetrack from './Racetrack';

export const TableRaceTrack = () => {
	const { isVertical } = useMediaQuery();
	const [isRacetrackOpen, setIsRacetrackOpen] = useState(false);

	const toggleRacetrack = () => {
		setIsRacetrackOpen((prev) => !prev);
	};

	return (
		<div className={cn('w-full grid grid-cols-12', {})}>
			{/* If vertical layout, Racetrack is always visible */}
			{/* {isVertical && <Racetrack />} */}

			{/* If not vertical, display the button and animate Racetrack */}
			{!isVertical && (
				<>
					<div className="col-span-1 flex justify-center items-center">
						<Button variant="ghost" onClick={toggleRacetrack} className="h-auto p-0 mb-2">
							<img src={miniTableImg} alt="Mini Table" className="h-12" />
						</Button>
					</div>
					<div className="col-span-10 flex justify-center">
						{/* Animate the Racetrack component */}
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{
								height: isRacetrackOpen ? 'auto' : 0,
								opacity: isRacetrackOpen ? 1 : 0,
							}}
							style={{ overflow: 'hidden' }} // Ensure smooth transition
						>
							<Racetrack />
						</motion.div>
					</div>
				</>
			)}
		</div>
	);
};
