import { useEffect, useRef, useState } from 'react';

import { getColor, getWheelNumbers } from '@/src/lib/roulette';
import { useMediaQuery } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import { motion } from 'framer-motion';
import { Sounds } from './Sounds';
import { WheelStatus } from './WheelStatus';
import { WinnerMessage } from './WinnerMessage';

export const Wheel = () => {
	const { isVertical } = useMediaQuery();
	const selectedNumber = '3'; // Example selected number
	const [status, setStatus] = useState('pending'); // Initialize status
	const wheelNumbers = getWheelNumbers();
	const innerRef = useRef<HTMLUListElement>(null);

	const getAngleForNumber = (number: number) => {
		const index = wheelNumbers.indexOf(number.toString()); // Convert number to string to match array
		if (index === -1) {
			console.error('Number not found in the wheelNumbers array');
			return null; // Return null or handle error as needed
		}

		const totalNumbers = wheelNumbers.length;
		const anglePerSegment = 360 / totalNumbers;
		const angle = index * anglePerSegment;

		return angle;
	};

	// Animation variants
	const rotateVariants = {
		pending: {
			rotate: getAngleForNumber(5),
		},
		rolled: {
			rotate: [getAngleForNumber(5), -960], // Start from 0 to 360 degrees
			top: ['0', '8%'],
			transition: {
				duration: 6, // Adjust duration for speed
				ease: 'easeInOut',
				loop: Number.MAX_SAFE_INTEGER, // Loop indefinitely while rolling
			},
		},
		landed: (stopAngle) => ({
			rotate: stopAngle,
			transition: {
				duration: 1, // Duration to slow down to stop
				ease: 'easeInOut',
			},
		}),
	};

	// Simulate the spin process (you can replace this with actual API call logic)
	const startSpin = () => {
		setStatus('rolled');

		// Simulate a timeout to represent the spin duration
		setTimeout(() => {
			setStatus('landed'); // Change state to landed after some time
		}, 12000); // Match this duration with the spin animation
	};

	// Automatically start spin when component mounts (for demonstration)
	useEffect(() => {
		setTimeout(() => {
			startSpin();
		}, 3000);
	}, []);

	return (
		<div className=" md:scale-125 -mt-32 mx-auto ">
			<div className={cn('mx-auto animate-wheel  ', {})}>
				<div className="absolute rounded-full bg-background/65 border border-border shadow-[inset_0px_0px_0px_2px_var(--bg-background)] top-[12%] left-[12%] right-[12%] bottom-[12%] z-[1]" />
				<div className="absolute rounded-full top-[-6px] right-[-6px] bottom-[-6px] left-[-6px] border-[6px] border-black-roulette shadow-[inset_0px_0px_0px_2px_var(--black-roulette),_0px_0px_0px_2px_var(--bg-black-roulette)]" />

				<ul className={cn('w-[350px] h-[350px] relative block', '')} ref={innerRef}>
					<motion.span
						variants={rotateVariants}
						initial="pending"
						animate={status === 'rolled' ? 'rolled' : 'landed'}
						custom={getAngleForNumber(5)} // Pass the stop angle to the landed variant
						className="bg-transparent absolute  w-8 top-0  bottom-0 z-10 flex justify-center !pt-[13%]"
						style={{
							left: 'calc(50% - (32px / 2))',
						}}
					>
						⚪
					</motion.span>
					<span className="absolute z-[3] top-[24%] right-[24%] bottom-[24%] left-[24%] bg-center bg-cover bg-[url('./assets/roulette-center.svg')] " />
					{wheelNumbers.map((number, index) => (
						<li
							key={`wheel-${number}`}
							className={cn(
								'bg-transparent absolute top-0 -translate-x-1/2 border-l-transparent border-r-transparent border-l-[16px] border-r-[16px] border-t-[175px] w-8 h-[175px] text-center origin-bottom box-border',
								{
									'border-t-red-roulette': getColor(+number) === 'RED',
									'border-t-black-roulette': getColor(+number) === 'BLACK',
									'border-t-green-roulette': getColor(+number) === 'GREEN',
								},
							)}
							style={{
								transform: `rotate(${(360 / wheelNumbers.length) * +index}deg)`,
								left: 'calc(50% - (32px / 2))',
							}}
						>
							<span className="text-foreground pt-2 w-8 inline-block text-[12px] transform scale-x-100 scale-y-[1.2] absolute top-[-175px] left-[-16px]">
								{number}
							</span>
						</li>
					))}
				</ul>
			</div>

			{/* Sounds */}

			<Sounds />
			{/* Display the countdown for the user */}
			<WheelStatus />
			<WinnerMessage />
		</div>
	);
};

export default Wheel;
