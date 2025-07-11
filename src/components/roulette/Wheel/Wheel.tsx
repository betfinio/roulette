import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useQueryClient } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getWheelNumbers } from '@/src/lib/roulette';
import { useGetPlayerBets, useRouletteState } from '@/src/lib/roulette/query';
import type { WheelLanded, WheelState } from '@/src/lib/roulette/types';
import { useVisibleTable } from '@/src/lib/shared/query';
import RouletteWheel from '../../shared/RouletteWheel';

export const Wheel = () => {
	const queryClient = useQueryClient();
	const wheelNumbers = getWheelNumbers();
	const { address = ZeroAddress } = useAccount();
	const { state: wheelStateData, updateState } = useRouletteState();
	const status = wheelStateData.data.state;
	const { table } = useVisibleTable();

	const { isFetched: isBetsFetched, data: bets = [] } = useGetPlayerBets(table);
	const lastNumber = (wheelStateData.data as WheelLanded).result || 0;

	// Animation control
	const wheelControlsWrapper = useAnimation();
	const wheelControls = useAnimation();

	const getAngleForNumber = (number: number) => {
		const index = wheelNumbers.indexOf(number.toString());

		const totalNumbers = wheelNumbers.length;
		const anglePerSegment = 360 / totalNumbers;
		return index * anglePerSegment;
	};

	useEffect(() => {
		console.log('status', status, lastNumber, wheelNumbers);
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

			console.log('standby');

			wheelControlsWrapper.start({
				marginTop: '-50%',

				transition: {
					duration: 1, // Slow rotation duration
					ease: 'linear',
				},
			});
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

					const updatedBets = bets.filter((b) => b.bet.toLowerCase() !== bet?.bet.toLowerCase());

					queryClient.setQueryData(['roulette', 'bets', 'player', address], [bet, ...updatedBets], {
						updatedAt: Date.now(),
					});
					updateState({ state: 'landed' } as WheelState);
				});

			wheelControlsWrapper.start({
				marginTop: '-50%',

				transition: {
					duration: 3, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === 'landed') {
			const stopAngle = getAngleForNumber(lastNumber) || 0;
			wheelControlsWrapper.start({
				marginTop: '-50%',

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
		<div className="rl:w-full rl:max-w-2xl rl:mx-8 rl:lg:mx-auto rl:drop-shadow-[0_0_18px_var(--wheel-shadow)] rl:rounded-full">
			<motion.div className=" rl:relative rl:max-w-3xl	rl:aspect-square rl:pb-10" animate={wheelControlsWrapper}>
				<motion.div className={cn({ 'rl:blur-md rl:animate-pulse': !isBetsFetched })} animate={wheelControls}>
					<div className="rl:relative rl:aspect-square rl:w-full rl:max-w-3xl text-background-light">
						<div className="rl:absolute rl:rounded-full rl:top-[-6px] rl:right-[-6px] rl:bottom-[-6px] rl:left-[-6px]]  " />
						<RouletteWheel />
						<span className="rl:absolute rl:z-3 rl:top-[12%] rl:right-[12%] rl:bottom-[12%] rl:left-[12%] rl:bg-center rl:bg-cover rl:bg-roulette-center " />
					</div>
				</motion.div>
				<PlayIcon className={'rl:absolute rl:w-5 rl:h-5 rl:text-foreground rl:z-5 rl:bottom-6 rl:rotate-[270deg] rl:left-1/2 -translate-x-1/2'} />
			</motion.div>
		</div>
	);
};

export default Wheel;
