import { useGetCurrentRound, useGetSelectedRound, useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { type FC, useEffect, useState } from 'react';
import { BackToGame } from './BackToGame';
import { RoundNumber } from './RoundNumber';
import { Timer } from './Timer';

export const WheelDetails: FC = () => {
	const queryClient = useQueryClient();
	const { tableAddress = ZeroAddress } = useGetTableAddress();

	const { state } = useRouletteState();

	const { data: currentRound } = useGetCurrentRound(tableAddress);
	const { round: selectedRound, isRoundFinished } = useGetSelectedRound();

	const handleExpiration = (round: number) => {
		if (lastExpired !== round) {
			setLastExpired(round);

			queryClient.refetchQueries({ queryKey: ['roulette', 'currentRound'] });
		}
	};

	const { timeLeft, isReady, isExpired } = useRoundCountdown(selectedRound, Number(currentRound?.interval), handleExpiration);

	const [lastExpired, setLastExpired] = useState<number>();

	const rouletteIsNotSpinning = state.data.state !== 'spinning' && state.data.state !== 'landing';

	const showTimer = !isRoundFinished && isReady && !isExpired;
	const showBackToGame = isRoundFinished;
	const showRoundNumber = rouletteIsNotSpinning;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<motion.div
				key="countdown"
				className="  w-full h-full flex mt-[25%] flex-col   z-20 text-center  text-foreground    "
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.3, stiffness: 500 }}
			>
				{/* Round Number */}
				{showRoundNumber && (
					<div className="w-1/3 mb-[5%] flex justify-center mx-auto">
						<RoundNumber />
					</div>
				)}
				{/*  Timer */}
				{showTimer && (
					<div className={cn('w-1/4   inline-flex mx-auto ', {})}>
						<Timer timeLeft={timeLeft} />
					</div>
				)}
				{/*  Back to Game */}
				{showBackToGame && (
					<div className={cn('w-1/3  mx-auto inline-flex', {})}>
						<BackToGame />
					</div>
				)}
			</motion.div>
		</div>
	);
};

type CountdownResult = {
	timeLeft: string;
	isExpired: boolean;
	isReady: boolean;
};

export function useRoundCountdown(round?: number, interval?: number, onExpire?: (round: number) => void): CountdownResult {
	const [timeLeft, setTimeLeft] = useState<string>('--:--');
	const [isExpired, setIsExpired] = useState<boolean>(false);
	const [isReady, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		if (round === undefined || interval === undefined) {
			setIsReady(false);
			setTimeLeft('--:--');
			return;
		}

		// Calculate the current round based on the current timestamp
		const now = Math.floor(Date.now() / 1000); // Current time in seconds
		const currentRound = Math.floor(now / interval); // Calculate the current round

		// Determine if the round is finished
		if (currentRound > round) {
			setTimeLeft('00:00');
			setIsExpired(true);
			onExpire?.(round);
			setIsReady(false);
			return;
		}

		// Determine the end time of the round
		const roundEnd = (round + 1) * interval; // End time of the round in seconds

		// Timer logic
		const calculateTimeLeft = () => {
			const remainingTime = roundEnd - Math.floor(Date.now() / 1000); // Remaining time in seconds

			if (remainingTime <= 0) {
				setTimeLeft('00:00');
				setIsExpired(true);
				onExpire?.(round);
			} else {
				const minutes = Math.floor(remainingTime / 60)
					.toString()
					.padStart(2, '0');
				const seconds = (remainingTime % 60).toString().padStart(2, '0');
				setTimeLeft(`${minutes}:${seconds}`);
				setIsExpired(false);
			}
		};

		// Round is valid and not finished
		setIsReady(true);
		calculateTimeLeft(); // Initial calculation
		const intervalId = setInterval(calculateTimeLeft, 1000); // Update every second

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, [round, interval]); // Re-run if round or interval changes

	return { timeLeft, isExpired, isReady };
}
