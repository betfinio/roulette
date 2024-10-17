import { getWheelNumbers } from '@/src/lib/roulette';
import { useRouletteBets, useRouletteState } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Sounds } from './Sounds';

import { ZeroAddress } from '@betfinio/abi';
import { useAccount } from 'wagmi';
import RouletteWheel from './RouletteWheel';

export const Wheel = () => {
	const wheelNumbers = getWheelNumbers();

	const { state: wheelStateData } = useRouletteState();
	const status = wheelStateData.data.state;
	const { address = ZeroAddress } = useAccount();

	const { data: bets = [], isFetched: isBetsFetched } = useRouletteBets(address);
	const lastNumber = bets[0]?.winNumber ?? 0;

	// Animation control
	const wheelControlsWrapper = useAnimation();
	const wheelControls = useAnimation();
	const ballControls = useAnimation();

	const getAngleForNumber = (number: number) => {
		const index = wheelNumbers.indexOf(number.toString());

		const totalNumbers = wheelNumbers.length;
		const anglePerSegment = 360 / totalNumbers;
		return index * anglePerSegment;
	};

	useEffect(() => {
		console.log(lastNumber, 'lastNumber');
	}, [lastNumber]);

	// Handle animations based on status changes

	console.log(getAngleForNumber(lastNumber), 'getAngleForNumber(lastNumber)');
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

			ballControls.set({
				rotate: currentAngle,
			});

			wheelControlsWrapper.start({
				marginTop: '-50%',

				transition: {
					duration: 1, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === 'spinning') {
			wheelControls.start({
				rotate: [0, 360], // Single rotation, but will loop infinitely
				transition: {
					duration: 3, // Duration for one full rotation
					ease: 'linear', // Linear easing for constant speed
					repeat: Number.MAX_SAFE_INTEGER, // Repeat infinitely
				},
			});

			ballControls.start({
				rotate: [getAngleForNumber(lastNumber) || 0, -360], // Rotate one full circle
				top: ['0', '8%'], // Ball bounce effect
				transition: {
					duration: 1.5, // Speed of one ball rotation
					ease: 'linear', // Linear for constant speed
					repeat: Number.MAX_SAFE_INTEGER, // Repeat indefinitely
				},
			});
			wheelControlsWrapper.start({
				marginTop: '0',

				transition: {
					duration: 1, // Slow rotation duration
					ease: 'linear',
				},
			});
		} else if (status === 'landed') {
			const stopAngle = getAngleForNumber(lastNumber) || 0;
			wheelControls.start({
				rotate: [
					stopAngle % 360, // Start at the current angle
					(stopAngle % 360) + 360, // Go one full rotation beyond the current angle
				],
				transition: {
					repeat: Number.MAX_SAFE_INTEGER, // Continuous rotation
					duration: 20, // Slow rotation duration
					ease: 'linear',
				},
			});

			wheelControlsWrapper.start({
				marginTop: '-50%',

				transition: {
					duration: 1, // Slow rotation duration
					ease: 'linear',
				},
			});

			ballControls.start({
				rotate: stopAngle,
				top: 0, // Ball bounce effect
				transition: {
					duration: 2, // Deceleration duration
					ease: 'linear', // Smooth deceleration
				},
			});
		}
	}, [status, lastNumber, wheelControls]);

	return (
		<div className="w-full max-w-2xl mx-auto lg:drop-shadow-[0_0_20px_rgba(0,172,231,0.45)] rounded-full">
			<motion.div className="  mt-0   max-w-3xl	aspect-square pb-8" animate={wheelControlsWrapper}>
				<motion.div style={{}} className={cn()} animate={wheelControls}>
					<div className="relative aspect-square w-full max-w-3xl ">
						<div className="absolute rounded-full top-[-6px] right-[-6px] bottom-[-6px] left-[-6px]]  " />
						<RouletteWheel />
						<span className="absolute z-[3] top-[24%] right-[24%] bottom-[24%] left-[24%] bg-center bg-cover bg-[url('./assets/roulette-center.svg')] " />
						<motion.span
							animate={ballControls}
							className="bg-transparent absolute w-8 top-0 bottom-0 z-10 flex justify-center !pt-[13%]"
							style={{
								left: 'calc(50% - (32px / 2))',
							}}
						>
							⚪
						</motion.span>
					</div>
				</motion.div>

				{/* Sounds */}
				<Sounds />
			</motion.div>
		</div>
	);
};

export default Wheel;
