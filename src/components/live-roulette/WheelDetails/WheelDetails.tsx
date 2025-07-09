import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { motion } from 'motion/react';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import {
	useGetCurrentRound,
	useGetSelectedRound,
	useGetTableSelectedRoundBets,
	useLiveRouletteState,
	useTablePlayerRounds,
} from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { getColor } from '@/src/lib/roulette';
import { useVisibleTable } from '@/src/lib/shared/query';
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
	const { data: currentRound, isLoading, refetch: refetchCurrentRound } = useGetCurrentRound(table);
	const {
		round: selectedRound,
		isRoundFinished,
		roundHasBets: selectedRoundHasBets,
		winNumber,
		bankByRoundProps: { refetch: refetchBankByRound },
		winNumberProps,
		currentRoundBank,
	} = useGetSelectedRound();
	const { isLoading: isSelectedRoundBetsLoading } = useGetTableSelectedRoundBets(table, selectedRound);
	const { data: playerRounds = [] } = useTablePlayerRounds(table);

	const playerStat = useMemo(() => {
		if (!playerRounds || winNumber === 42n) return;
		const playerRound = playerRounds.find((round) => round.round === selectedRound);

		const hasWon = playerRound && playerRound?.winAmount > 0n;
		const winAmount = playerRound?.winAmount ?? 0n;

		return { playerHasWon: hasWon, playerHasBets: !!playerRound, winAmount: winAmount };
	}, [playerRounds, winNumber, selectedRound]);

	const handleExpiration = async () => {
		refetchBankByRound();
		refetchCurrentRound();
	};

	const { timeLeft, isReady, isExpired } = useRoundCountdown(selectedRound, Number(currentRound?.interval), handleExpiration);

	const rouletteIsNotSpinning = state.data.state !== WheelStatus.Requested && state.data.state !== WheelStatus.Landing;
	const rouletteStatusStandBy = state.data.state === WheelStatus.NotExist || state.data.state === WheelStatus.Created;
	const roundHasBets = selectedRoundHasBets;
	const showTimer = !isRoundFinished && isReady && !isExpired && rouletteIsNotSpinning;
	const showRoundNumber = rouletteIsNotSpinning && !!selectedRound;
	const showWaitingForSpin =
		roundHasBets && isRoundFinished && winNumber === 42n && ![WheelStatus.Finished, WheelStatus.Requested, WheelStatus.Landing].includes(state.data.state);

	const showRoundIsOver = isRoundFinished && rouletteIsNotSpinning && !roundHasBets && currentRoundBank !== undefined;

	const showYouWon = isRoundFinished && rouletteIsNotSpinning && !rouletteStatusStandBy && playerStat?.playerHasBets && playerStat.playerHasWon;

	const showWinNumber = rouletteIsNotSpinning && isRoundFinished && winNumber !== 42n;

	const showBackToGame = isRoundFinished && rouletteIsNotSpinning && (showRoundIsOver || showYouWon || showWinNumber || showWaitingForSpin);

	console.log('render', isLoading, isSelectedRoundBetsLoading, !rouletteIsNotSpinning, winNumberProps.isLoading);
	if (isLoading || isSelectedRoundBetsLoading || !rouletteIsNotSpinning || winNumberProps.isLoading) return null;

	return (
		<div className="rl:absolute rl:inset-0 rl:flex rl:items-center rl:justify-center">
			<motion.div
				key={state.data.state + winNumber.toString()}
				className="rl:w-full rl:h-full rl:flex rl:mt-[15%] rl:md:mt-[20%] rl:flex-col  rl:z-20 rl:text-center  rl:text-foreground    "
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.3, stiffness: 500 }}
			>
				{/* Round Number */}
				{showRoundNumber && (
					<div
						className={cn('rl:w-1/3 rl:flex rl:justify-center rl:items-center rl:mx-auto', {
							'rl:mb-[5%]': !showWinNumber,
						})}
					>
						<RoundNumber />
					</div>
				)}
				{/* Round Number */}
				{showWinNumber && (
					<div
						className={cn(
							'rl:w-[10%] rl:flex rl:justify-center rl:items-center rl:mx-auto rl:border rl:md:border-2 rl:border-white/50 rl:rounded-lg rl:md:rounded-2xl rl:md:mb-2',
							{
								'rl:bg-green-roulette': getColor(Number(winNumber)) === 'GREEN',
								'rl:bg-red-roulette': getColor(Number(winNumber)) === 'RED',
								'rl:bg-black-roulette': getColor(Number(winNumber)) === 'BLACK',
							},
						)}
					>
						<RouletteNumberIcon number={Number(winNumber)} className={'rl:w-full'} />
					</div>
				)}
				{/*  Waiting For Spin */}
				{showWaitingForSpin && (
					<div className={cn('rl:w-1/3 rl:flex rl:flex-col rl:mx-auto rl:mb-4 ')}>
						<ManualSpin />
					</div>
				)}

				{/*  You won */}
				{!!showYouWon && (
					<div className={cn('rl:w-1/5 rl:inline-flex rl:mx-auto ', {})}>
						<DynamicTextSVG text="You Won !" />
					</div>
				)}
				{!!showYouWon && (
					<div className={cn('rl:w-1/4 rl:flex rl:justify-center rl:mx-auto rl:-mt-2 rl:md:text-xl', {})}>
						+<BetValue value={playerStat?.winAmount} withIcon />
					</div>
				)}
				{/*  Timer */}
				{showTimer && (
					<div className={cn('rl:w-1/4 rl:inline-flex rl:mx-auto ', {})}>
						<Timer timeLeft={timeLeft} />
					</div>
				)}
				{/* Round Is Over */}
				{showRoundIsOver && (
					<div className={cn('rl:w-1/3 rl:mx-auto rl:inline-flex rl:mb-2', {})}>
						<RoundIsOver />
					</div>
				)}
				{/*  Back to Game */}

				{showBackToGame && (
					<div className={cn('rl:w-1/3 rl:mx-auto rl:inline-flex rl:mt-1', {})}>
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
	const refInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
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
	}, [round, interval, onExpire]); // Re-run if round or interval changes

	return { timeLeft, isExpired, isReady };
}
