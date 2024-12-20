import { cn } from '@betfinio/components';
import { motion } from 'framer-motion';
import { type FC, useEffect, useState } from 'react';
import { Timer } from './Timer';

interface IWheelTimeProps {
	round: number;
	interval: number;
}
export const WheelTime: FC<IWheelTimeProps> = ({ round, interval }) => {
	const { timeLeft, isReady } = useRoundCountdown(round, interval);

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<motion.div
				key="countdown"
				className="  w-full h-full flex justify-center   z-20 text-center  text-foreground    "
				style={{
					fontSize: `${20}px`,
				}}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.3, stiffness: 500 }}
			>
				<div
					className={cn('w-1/2 mb-20 inline-flex', {
						hidden: !isReady || timeLeft === '00:00',
					})}
				>
					<Timer timeLeft={timeLeft} />
				</div>
				{/* <div
          className={cn("w-1/3 mb-20 cursor-pointer", {
            hidden: !isReady || timeLeft === "00:00",
            flex: isReady && timeLeft === "00:00",
          })}
        >
          <BackToGame />
        </div> */}
			</motion.div>
		</div>
	);
};

type CountdownResult = {
	timeLeft: string;
	isExpired: boolean;
	isReady: boolean;
};

export function useRoundCountdown(round?: number, interval?: number): CountdownResult {
	const [timeLeft, setTimeLeft] = useState<string>('--:--');
	const [isExpired, setIsExpired] = useState<boolean>(false);
	const [isReady, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		if (round === undefined || interval === undefined) {
			setIsReady(false);
			setTimeLeft('--:--');
			return;
		}

		setIsReady(true);

		const calculateTimeLeft = () => {
			const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
			const roundStart = round * interval; // Start time of the round
			const roundEnd = (round + 1) * interval; // End time of the round
			const remainingTime = roundEnd - now; // Time remaining in seconds

			if (remainingTime <= 0) {
				setTimeLeft('00:00');
				setIsExpired(true);
			} else {
				const minutes = Math.floor(remainingTime / 60)
					.toString()
					.padStart(2, '0');
				const seconds = (remainingTime % 60).toString().padStart(2, '0');
				setTimeLeft(`${minutes}:${seconds}`);
				setIsExpired(false);
			}
		};

		calculateTimeLeft(); // Initial calculation

		const intervalId = setInterval(calculateTimeLeft, 1000); // Update every second

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, [round, interval]); // Re-run if round or interval changes

	return { timeLeft, isExpired, isReady };
}
