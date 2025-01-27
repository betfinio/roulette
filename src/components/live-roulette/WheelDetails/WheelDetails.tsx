import { useGetCurrentRound, useGetSelectedRound, useGetTableSelectedRoundBets, useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useVisibleTable } from '@/src/lib/shared/query';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { motion } from 'framer-motion';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { RouletteNumberIcon } from '../../shared/RouletteNumberIcon';
import { BackToGame } from './BackToGame';
import { DynamicTextSVG } from './DynamicTextSVG';
import ManualSpin from './ManualSpin';
import { RoundIsOver } from './RoundIsOver';
import { RoundNumber } from './RoundNumber';
import { Timer } from './Timer';

export const WheelDetails: FC = () => {
	const { table = ZeroAddress } = useVisibleTable();

	const { state } = useLiveRouletteState();
	const { address } = useAccount();
	const { data: currentRound, isLoading, refetch: refetchCurrentRound } = useGetCurrentRound(table);
	const {
		round: selectedRound,
		isRoundFinished,
		roundHasBets: selectedRoundHasBets,
		winNumber,
		bankByRoundProps: { refetch: refetchBankByRound },
		winNumberProps,
	} = useGetSelectedRound();
	const { data: tableRoundBets, isLoading: isSelectedRoundBetsLoading } = useGetTableSelectedRoundBets(table, selectedRound);

	const playerStat = useMemo(() => {
		if (!tableRoundBets || winNumber === 42n) return;
		const playerBets = tableRoundBets.filter((bet) => bet.player.toLowerCase() === address?.toLowerCase());
		const hasWon = playerBets.some((bet) => bet.chips.some((chip) => (BigInt(chip.bitMap) & (2n ** winNumber)) > 0n));
		const winAmount = playerBets.reduce((acc, bet) => {
			return (bet.winAmount ?? 0n) + acc;
		}, 0n);
		const betAmount = playerBets.reduce((acc, bet) => {
			return (bet.amount ?? 0n) + acc;
		}, 0n);
		return { playerHasWon: hasWon, playerHasBets: playerBets.length, winAmount: winAmount, betAmount: betAmount };
	}, [tableRoundBets, address, winNumber, isRoundFinished]);

	const handleExpiration = async () => {
		refetchBankByRound();
		refetchCurrentRound();
	};

	const { timeLeft, isReady, isExpired } = useRoundCountdown(selectedRound, Number(currentRound?.interval), handleExpiration);

	const rouletteIsNotSpinning = state.data.state !== WheelStatus.Requested && state.data.state !== WheelStatus.Landing;
	const rouletteStatusStandBy = state.data.state === WheelStatus.NotExist || state.data.state === WheelStatus.Created;
	const roundHasBets = selectedRoundHasBets;
	const showTimer = !isRoundFinished && isReady && !isExpired && rouletteIsNotSpinning;
	const showBackToGame = isRoundFinished && rouletteIsNotSpinning;
	const showRoundNumber = rouletteIsNotSpinning;
	const showWaitingForSpin = roundHasBets && isRoundFinished && winNumber === 42n && state.data.state !== WheelStatus.Finished;

	const showRoundIsOver = isRoundFinished && rouletteIsNotSpinning && !roundHasBets;

	const showYouWon = isRoundFinished && rouletteIsNotSpinning && !rouletteStatusStandBy && playerStat?.playerHasBets && playerStat.playerHasWon;

	const showWinNumber = rouletteIsNotSpinning && isRoundFinished && winNumber !== 42n;

	if (isLoading || isSelectedRoundBetsLoading || !rouletteIsNotSpinning || winNumberProps.isLoading) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<motion.div
				key="countdown"
				className="  w-full h-full flex mt-[15%] md:mt-[20%] flex-col  z-20 text-center  text-foreground    "
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.3, stiffness: 500 }}
			>
				{/* Round Number */}
				{showRoundNumber && (
					<div
						className={cn('w-1/3 flex justify-center items-center mx-auto', {
							'mb-[5%]': !showWinNumber,
						})}
					>
						<RoundNumber />
					</div>
				)}
				{/* Round Number */}
				{showWinNumber && (
					<div className="w-[10%] flex justify-center items-center mx-auto border md:border-2 border-white/60 rounded-lg md:rounded-2xl md:mb-2">
						<RouletteNumberIcon number={Number(winNumber)} className={'w-full'} />
					</div>
				)}
				{/*  Waiting For Spin */}
				{showWaitingForSpin && (
					<div className={cn('w-1/3 flex flex-col mx-auto mb-4 ')}>
						<ManualSpin />
					</div>
				)}

				{/*  You won */}
				{!!showYouWon && (
					<div className={cn('w-1/5 inline-flex mx-auto ', {})}>
						<DynamicTextSVG text="You Won !" />
					</div>
				)}
				{!!showYouWon && (
					<div className={cn('w-1/4 flex justify-center mx-auto -mt-2 md:text-xl', {})}>
						+<BetValue value={playerStat?.winAmount} withIcon />
					</div>
				)}
				{/*  Timer */}
				{showTimer && (
					<div className={cn('w-1/4   inline-flex mx-auto ', {})}>
						<Timer timeLeft={timeLeft} />
					</div>
				)}
				{/* Round Is Over */}
				{showRoundIsOver && (
					<div className={cn('w-1/3  mx-auto inline-flex mb-2', {})}>
						<RoundIsOver />
					</div>
				)}
				{/*  Back to Game */}

				{showBackToGame && (
					<div className={cn('w-1/3  mx-auto inline-flex mt-1', {})}>
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

export function useRoundCountdown(round?: number, interval?: number, onExpire?: (round: number) => Promise<void>): CountdownResult {
	const [timeLeft, setTimeLeft] = useState<string>('--:--');
	const [isExpired, setIsExpired] = useState<boolean>(false);
	const [isReady, setIsReady] = useState<boolean>(false);
	const refInterval = useRef<ReturnType<typeof setInterval>>();
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
			// onExpire?.(round);
			setIsReady(false);
			return;
		}

		// Determine the end time of the round
		const roundEnd = (round + 1) * interval; // End time of the round in seconds

		// Timer logic
		const calculateTimeLeft = async () => {
			const remainingTime = roundEnd - Math.floor(Date.now() / 1000); // Remaining time in seconds

			if (remainingTime <= 0) {
				setTimeLeft('00:00');
				setIsExpired(true);
				await onExpire?.(round);
				refInterval.current && clearInterval(refInterval.current);
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
		refInterval.current = setInterval(calculateTimeLeft, 1000); // Update every second

		return () => clearInterval(refInterval.current); // Cleanup on unmount
	}, [round, interval]); // Re-run if round or interval changes

	return { timeLeft, isExpired, isReady };
}
