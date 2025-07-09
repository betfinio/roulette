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
					<div className="rl:col-span-1 rl:flex rl:justify-center rl:items-center">
						<Button variant="ghost" onClick={toggleRacetrack} className="rl:h-auto rl:p-0 rl:mb-2">
							<img src={miniTableImg} alt="Mini Table" className="rl:h-14" />
						</Button>
					</div>
					<div className="rl:col-span-10 rl:flex rl:justify-center">
						<Dialog open={isRacetrackOpen} onOpenChange={setIsRacetrackOpen}>
							<DialogContent className="rl:p-0">
								<DialogTitle className={'rl:hidden'} />
								<DialogDescription className={'rl:hidden'} />
								<div className="rl:p-4">
									{' '}
									<Racetrack onPlace={() => setIsRacetrackOpen(false)} />{' '}
								</div>{' '}
							</DialogContent>
						</Dialog>
					</div>
				</>
			)}
		</div>
	);
};
