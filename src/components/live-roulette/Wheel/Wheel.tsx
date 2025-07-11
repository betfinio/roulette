import { cn } from '@betfinio/components';
import { useQueryClient } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { useEffect, useState } from 'react';
import { useGetSelectedRound, useGetTableSelectedRoundBets, useLiveRouletteState, useTablePlayerRounds, useTableRounds } from '@/src/lib/live-roulette/query';
import { type WheelState, WheelStatus } from '@/src/lib/live-roulette/types';
import { getWheelNumbers } from '@/src/lib/roulette';
import { useVisibleTable } from '@/src/lib/shared/query';
import RouletteWheel from '../../shared/RouletteWheel';
import { WheelDetails } from '../WheelDetails/WheelDetails';

export const Wheel = () => {
	const queryClient = useQueryClient();
	const wheelNumbers = getWheelNumbers();
	const { state: wheelStateData, updateState } = useLiveRouletteState();
	const status = wheelStateData.data.state;
	const { table } = useVisibleTable();
	const { roundStatusProps, winNumberProps, round: selectedRound } = useGetSelectedRound();
	const { isFetched: isBetsFetched, data: rounds = [], queryKey: tableRoundsQueryKey } = useTableRounds(table);
	const { data: playerRounds = [], queryKey: playerRoundQueryKey } = useTablePlayerRounds(table);
	const lastNumber = rounds.find((tableRound) => tableRound.round === selectedRound)?.winNumber || 0;
	const { queryKey: tableSelectedRoundBetsQueryKey } = useGetTableSelectedRoundBets(table, selectedRound);

	// Animation control
	const wheelControlsWrapper = useAnimation();
	const wheelControls = useAnimation();

	const getAngleForNumber = (number: number) => {
		const index = wheelNumbers.indexOf(number.toString());

		const totalNumbers = wheelNumbers.length;
		const anglePerSegment = 360 / totalNumbers;
		return index * anglePerSegment;
	};

	const [initialAnimationFinished, setInitialAnimationFinished] = useState(false);

	useEffect(() => {
		if (status === WheelStatus.Created || status === WheelStatus.NotExist) {
			const currentAngle = getAngleForNumber(lastNumber);
			wheelControls.start({
				rotate: [
					currentAngle % 360, // Start at the current angle
					(currentAngle % 360) + 360, // Go one full rotation beyond the current angle
				],
				transition: {
					repeat: Number.MAX_SAFE_INTEGER, // Continuous rotation
					duration: 20, // Slow rotation duration
					ease: 'linear',
				},
			});

			wheelControlsWrapper
				.start({
					marginTop: '-30%',

					transition: {
						duration: 1, // Slow rotation duration
						ease: 'linear',
					},
				})
				.then(() => setInitialAnimationFinished(true));
		} else if (status === WheelStatus.Requested) {
			wheelControls.start({
				rotate: [0, -360], // Single rotation, but will loop infinitely
				transition: {
					duration: 0.4, // Duration for one full rotation
					ease: 'linear', // Linear easing for constant speed
					repeat: Number.MAX_SAFE_INTEGER, // Repeat infinitely
				},
			});

			wheelControlsWrapper.start({
				marginTop: '5%',

				transition: {
					duration: 3, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === WheelStatus.Landing) {
			const stopAngle = getAngleForNumber(wheelStateData.data.result || 0) || 0;

			wheelControls
				.start({
					rotate: [stopAngle + 360, -stopAngle + 180],
					transition: {
						duration: 3, // Slow rotation duration
						ease: [0.165, 0.84, 0.44, 1.005],
					},
				})
				.then(async () => {
					const { tableRound, tablePlayerRound, tableSelectedRoundBets } = wheelStateData.data;
					//Populate all bets for the current round
					if (tableRound) {
						const updatedRounds = rounds.map((round) => {
							if (round.round === tableRound.round) {
								return tableRound;
							}
							return round;
						});
						queryClient.setQueryData(tableRoundsQueryKey, updatedRounds, {
							updatedAt: Date.now(),
						});
					}

					//Populate all bets for the current round for the player

					if (tablePlayerRound) {
						const updatedPlayerRounds = playerRounds.map((round) => {
							if (round.round === tablePlayerRound.round) {
								return tablePlayerRound;
							}
							return round;
						});

						queryClient.setQueryData(playerRoundQueryKey, updatedPlayerRounds, {
							updatedAt: Date.now(),
						});
					}
					if (tableSelectedRoundBets) {
						queryClient.setQueryData(tableSelectedRoundBetsQueryKey, tableSelectedRoundBets, {
							updatedAt: Date.now(),
						});
					}

					updateState({ state: WheelStatus.JustFinished } as WheelState);
					setTimeout(async () => {
						roundStatusProps.refetch();
						winNumberProps.refetch();
					}, 500);
				});

			wheelControlsWrapper.start({
				marginTop: '-30%',

				transition: {
					duration: 3, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === WheelStatus.Finished) {
			const stopAngle = getAngleForNumber(lastNumber) || 0;
			wheelControlsWrapper
				.start({
					marginTop: '-30%',

					transition: {
						duration: 1, // Slow rotation duration
						ease: 'linear',
					},
				})
				.then(() => setInitialAnimationFinished(true));
			wheelControls.stop();
			wheelControls.set({
				rotate: [-stopAngle + 180],
			});
		}
	}, [status, wheelControls, lastNumber]);

	return (
		<div className="rl:w-full rl:flex rl:flex-col rl:relative rl:max-w-2xl rl:mx-8 rl:lg:mx-auto rl:drop-shadow-[0_0_18px_var(--wheel-shadow)] rl:rounded-full">
			{initialAnimationFinished && <WheelDetails />}
			<motion.div className="rl:w-full rl:mt-0 rl:relative rl:max-w-3xl	rl:aspect-square rl:pb-10" animate={wheelControlsWrapper}>
				<motion.div className={cn({ 'rl:blur-md rl:animate-pulse': !isBetsFetched })} animate={wheelControls}>
					<div className="rl:relative rl:aspect-square rl:w-full rl:max-w-3xl rl:text-background-light ">
						<div className="rl:absolute rl:rounded-full rl:top-[-6px] rl:right-[-6px] rl:bottom-[-6px] rl:left-[-6px]]  " />
						<RouletteWheel />
						<span className="rl:absolute rl:z-3 rl:top-[12%] rl:right-[12%] rl:bottom-[12%] rl:left-[12%] rl:bg-center rl:bg-cover rl:bg-roulette-center " />
					</div>
				</motion.div>
				<PlayIcon className={'rl:absolute rl:w-5 rl:h-5 rl:text-foreground rl:z-5 rl:bottom-6 rl:rotate-[270deg] rl:left-1/2 rl:-translate-x-1/2'} />
			</motion.div>
		</div>
	);
};

export default Wheel;
