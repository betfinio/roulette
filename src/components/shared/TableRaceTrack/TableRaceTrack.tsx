import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@betfinio/components/ui';
import { useState } from 'react';
import miniTableImg from '@/src/assets/images/mini-table.svg';
import Racetrack from './Racetrack';

export const TableRaceTrack = () => {
	const { isVertical } = useMediaQuery();
	const [isRacetrackOpen, setIsRacetrackOpen] = useState(false);

	const toggleRacetrack = () => {
		setIsRacetrackOpen((prev) => !prev);
	};

	return (
		<div className={cn(' ', {})}>
			{/* If vertical layout, Racetrack is always visible */}
			{/* {isVertical && <Racetrack />} */}

			{/* If not vertical, display the button and animate Racetrack */}
			{!isVertical && (
				<>
					<div className="col-span-1 flex justify-center items-center">
						<Button variant="ghost" onClick={toggleRacetrack} className="h-auto p-0 mb-2">
							<img src={miniTableImg} alt="Mini Table" className="h-14" />
						</Button>
					</div>
					<div className="col-span-10 flex justify-center">
						<Dialog open={isRacetrackOpen} onOpenChange={setIsRacetrackOpen}>
							<DialogContent className="roulette">
								<DialogTitle className={'hidden'} />
								<DialogDescription className={'hidden'} />
								<div className="p-4">
									<Racetrack onPlace={() => setIsRacetrackOpen(false)} />
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</>
			)}
		</div>
	);
};
