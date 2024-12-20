import { getWheelNumbers } from '@/src/lib/roulette';
import { useGetCurrentRound, useGetPlayerBets, useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import type { WheelLanded, WheelState } from '@/src/lib/roulette/types';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useQueryClient } from '@tanstack/react-query';
import { motion, useAnimation } from 'framer-motion';
import { PlayIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import RouletteWheel from '../../shared/RouletteWheel';
import { WheelTime } from '../WheelTime/WheelTime';

export const Wheel = () => {
	const queryClient = useQueryClient();
	const wheelNumbers = getWheelNumbers();
	const { address = ZeroAddress } = useAccount();
	const { state: wheelStateData, updateState } = useRouletteState();
	const status = wheelStateData.data.state;
	const { tableAddress } = useGetTableAddress();
	const { data: currentRound } = useGetCurrentRound(tableAddress);
	const { isFetched: isBetsFetched, data: bets = [] } = useGetPlayerBets(tableAddress);
	const lastNumber = (wheelStateData.data as WheelLanded).result || 0;
	console.log(currentRound, 'currentRound');
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
		if (status === 'standby') {
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
		} else if (status === 'spinning') {
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
		} else if (status === 'landing') {
			const stopAngle = getAngleForNumber(lastNumber) || 0;

			wheelControls
				.start({
					rotate: [stopAngle + 360, -stopAngle + 180],
					transition: {
						duration: 3, // Slow rotation duration
						ease: [0.165, 0.84, 0.44, 1.005],
					},
				})
				.then(async () => {
					const { bet } = wheelStateData.data as WheelLanded;
					queryClient.setQueryData(['roulette', 'bets', 'player', address], [bet, ...bets], {
						updatedAt: Date.now(),
					});
					updateState({ state: 'landed' } as WheelState);
				});

			wheelControlsWrapper.start({
				marginTop: '-30%',

				transition: {
					duration: 3, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === 'landed') {
			const stopAngle = getAngleForNumber(lastNumber) || 0;
			wheelControlsWrapper.start({
				marginTop: '-30%',

				transition: {
					duration: 1, // Slow rotation duration
					ease: 'linear',
				},
			});

			wheelControls.set({
				rotate: [-stopAngle + 180],
			});
		}
	}, [status, wheelControls]);

	return (
		<>
			<div className="w-full flex flex-col relative max-w-2xl mx-8 lg:mx-auto drop-shadow-[0_0_18px_rgba(0,172,231,0.45)] rounded-full">
				{currentRound && initialAnimationFinished && <WheelTime round={Number(currentRound?.round)} interval={Number(currentRound?.interval)} />}
				<motion.div className=" relative  mt-0   max-w-3xl	aspect-square pb-10" animate={wheelControlsWrapper}>
					<motion.div style={{}} className={cn({ 'blur-md animate-pulse': !isBetsFetched })} animate={wheelControls}>
						<div className="relative aspect-square w-full max-w-3xl ">
							<div className="absolute rounded-full top-[-6px] right-[-6px] bottom-[-6px] left-[-6px]]  " />
							<RouletteWheel />
							<span className="absolute z-[3] top-[12%] right-[12%] bottom-[12%] left-[12%] bg-center bg-cover bg-roulette-center " />
						</div>
					</motion.div>
					<PlayIcon className={'absolute w-5 h-5 text-foreground z-5 bottom-6 rotate-[270deg] left-1/2 -translate-x-1/2'} />
				</motion.div>
			</div>
		</>
	);
};

export default Wheel;
