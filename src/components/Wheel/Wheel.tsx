import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import cashIcon from '../../assets/images/chip-betfin.svg';
import coinRainSoundFile from '../../assets/sounds/coin-rain.wav'; // Coin rain sound
import spinSoundFile from '../../assets/sounds/roulette-ball.wav'; // Spin sound
import winSoundFile from '../../assets/sounds/win.wav'; // Win sound
import { useWheel } from '../../contexts/WheelContext';
import './Wheel.css';

// Function to generate European roulette numbers with alternating colors
const getWheelNumbers = () => [
	'0',
	'32',
	'15',
	'19',
	'4',
	'21',
	'2',
	'25',
	'17',
	'34',
	'6',
	'27',
	'13',
	'36',
	'11',
	'30',
	'8',
	'23',
	'10',
	'5',
	'24',
	'16',
	'33',
	'1',
	'20',
	'14',
	'31',
	'9',
	'22',
	'18',
	'29',
	'7',
	'28',
	'12',
	'35',
	'3',
	'26',
];

// Function to get the color based on the number
const getNumberColor = (num: string) => {
	const greenNumbers = ['0'];
	const redNumbers = ['32', '19', '21', '25', '34', '27', '36', '30', '23', '5', '16', '1', '14', '9', '18', '7', '12', '3'];
	const blackNumbers = ['15', '4', '2', '17', '6', '13', '11', '8', '10', '24', '33', '20', '31', '22', '29', '28', '35', '26'];

	if (greenNumbers.includes(num)) return 'var(--green)';
	if (redNumbers.includes(num)) return 'var(--red)';
	if (blackNumbers.includes(num)) return 'var(--black)';
	return '';
};

export const Wheel = () => {
	const { isVertical, handleDoSpin, stopSpin, setNumCoins, isWheelWheelSpinning, selectedNumber } = useWheel();

	const [wheelNumbers, setWheelNumbers] = useState<string[]>([]);
	const [showWinnerMessage, setShowWinnerMessage] = useState(false);
	const [remainingTime, setRemainingTime] = useState<number>(0);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [currentRound, setCurrentRound] = useState<any>(null);
	const [winningAmount, setWinningAmount] = useState<number>(0);
	const [isFetchingResult, setIsFetchingResult] = useState<boolean>(false);
	const [isProcessingResult, setIsProcessingResult] = useState<boolean>(false); // To show result processing message
	const [lastUpdated, setLastUpdated] = useState<number>(Date.now()); // Track the last round fetch for regular updates

	const innerRef = useRef<HTMLUListElement>(null);

	// Sound references
	const spinSound = useRef<HTMLAudioElement | null>(null);
	const winSound = useRef<HTMLAudioElement | null>(null);
	const coinRainSound = useRef<HTMLAudioElement | null>(null);

	// Sound volume states
	const [spinVolume] = useState(1);
	const [winVolume] = useState(0.1);
	const [coinRainVolume] = useState(0.1);

	useEffect(() => {
		setWheelNumbers(getWheelNumbers());
	}, []);

	// Function to start the spin and show the message after it finishes
	async function startSpinAndShowMessage(winningNumber: string, winningAmount: number) {
		setWinningAmount(winningAmount);

		if (!isWheelWheelSpinning) {
			handleDoSpin(winningNumber);
		}
	}

	// Function to fetch the current round
	const { data: fetchedRound, refetch } = useQuery(
		'currentRound',
		async () => {
			const response = await fetch('http://localhost:7777/api/currentRound');
			if (!response.ok) throw new Error('Failed to fetch current round');
			return response.json();
		},
		{ refetchInterval: false },
	);

	// Function to check if the round has completed
	const checkCompletedRound = async (roundId: string) => {
		setIsProcessingResult(true);
		setIsFetchingResult(true);
		try {
			const response = await fetch(`http://localhost:7777/api/round/${roundId}`);
			if (!response.ok) throw new Error('Failed to fetch round by ID');

			const roundData = await response.json();
			if (roundData.status === 'completed') {
				setIsFetchingResult(false);
				setIsProcessingResult(false);
				// Spin and message
				await startSpinAndShowMessage(roundData.winningNumber, roundData.winningAmount);
			} else {
				// Retry if round is not completed
				setTimeout(() => checkCompletedRound(roundId), 1000);
			}
		} catch (error) {
			console.error('Error fetching completed round:', error);
			setIsFetchingResult(false);
			setIsProcessingResult(false);
		}
	};

	// Control the current round and schedule the request
	useEffect(() => {
		if (fetchedRound) {
			setCurrentRound(fetchedRound);

			// Display timer for the user
			const now = Date.now();
			const endTime = new Date(fetchedRound.endTime).getTime();
			const timeLeft = Math.max(0, endTime - now);
			setRemainingTime(timeLeft);

			// When the timer reaches 0, start checking for the completed round
			setTimeout(() => checkCompletedRound(fetchedRound.id), timeLeft + 1000);
		}
	}, [fetchedRound]);

	// Regularly fetch the current round every 5 seconds
	useEffect(() => {
		const updateInterval = setInterval(() => {
			const now = Date.now();
			if (now - lastUpdated >= 5000 && !isFetchingResult) {
				refetch(); // Update round info every 5 seconds
				setLastUpdated(now);
			}
		}, 5000);

		return () => clearInterval(updateInterval);
	}, [lastUpdated, isFetchingResult, refetch]);

	// Update the countdown timer
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (remainingTime > 0) {
			timer = setTimeout(() => {
				setRemainingTime((prevTime) => prevTime - 1000);
			}, 1000);
		}
		return () => clearTimeout(timer);
	}, [remainingTime]);

	// Function to format the time for display
	const formatTime = (milliseconds: number): string => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60)
			.toString()
			.padStart(2, '0');
		const seconds = (totalSeconds % 60).toString().padStart(2, '0');
		return `${minutes}:${seconds}`;
	};

	// Control the spin
	useEffect(() => {
		const currentInnerRef = innerRef.current;

		if (selectedNumber === '-1' || !currentInnerRef || !isWheelWheelSpinning) {
			return;
		}

		// Start spin sound and synchronize with the spin duration
		if (spinSound.current) {
			spinSound.current.currentTime = 0;
			spinSound.current.volume = spinVolume;

			// Ensure the duration is valid and finite before setting playbackRate
			const soundDuration = spinSound.current.duration;
			if (Number.isFinite(soundDuration) && soundDuration > 0) {
				spinSound.current.playbackRate = soundDuration / 9; // Adjust sound duration to match spin time
				spinSound.current.play().catch((error) => {
					console.error('Error playing spin sound:', error);
				});
			} else {
				console.error('Invalid sound duration, cannot set playback rate');
			}
		}

		currentInnerRef.classList.remove('rest');
		currentInnerRef.removeAttribute('data-spintoindex');

		const betIndex = wheelNumbers.indexOf(selectedNumber);

		setTimeout(() => {
			currentInnerRef.setAttribute('data-spintoindex', `${betIndex}`);
			setTimeout(() => {
				currentInnerRef.classList.add('rest');
				stopSpin();
				handleShowWinnerMessage();
			}, 9000);
		}, 100);
	}, [selectedNumber, isWheelWheelSpinning, wheelNumbers, stopSpin, spinVolume]);

	const handleShowWinnerMessage = () => {
		// Victory and coin sounds
		if (winningAmount > 0) {
			if (winSound.current) {
				winSound.current.currentTime = 0;
				winSound.current.volume = winVolume;
				winSound.current.play();
			}
			if (coinRainSound.current) {
				coinRainSound.current.currentTime = 0;
				coinRainSound.current.volume = coinRainVolume;
				coinRainSound.current.play();
			}
		}

		setNumCoins(1);
		setShowWinnerMessage(true);

		setTimeout(() => {
			setShowWinnerMessage(false);
			setNumCoins(0);
		}, 2200);
	};

	return (
		<div className="roulette-wheel-container md:scale-125 -mt-32 mx-auto">
			<div className={`mx-auto roulette-wheel-plate-with-animation roulette-wheel-plate ${isVertical ? 'roulette-wheel-plate-v' : 'roulette-wheel-plate-h'}`}>
				<ul className="roulette-wheel-inner" ref={innerRef}>
					{wheelNumbers.map((number) => (
						<li key={`wheel-${number}`} data-bet={number} className="roulette-wheel-bet-number" style={{ borderTopColor: getNumberColor(number) }}>
							<label htmlFor={`wheel-pit-${number}`}>
								<input type="radio" name="pit" id={`wheel-pit-${number}`} defaultValue={number} disabled />
								<span className="roulette-wheel-pit">{number}</span>
							</label>
						</li>
					))}
				</ul>
			</div>

			{/* Sounds */}
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={spinSound} src={spinSoundFile} />
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={winSound} src={winSoundFile} />
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={coinRainSound} src={coinRainSoundFile} />

			{/* Display the countdown for the user */}
			{!isWheelWheelSpinning && !showWinnerMessage ? (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3, stiffness: 500 }}
						className="absolute w-full flex flex-col items-center justify-center text-center mt-28 md:mt-0 pr-8 md:pr-0 text-white z-20 -top-1/3  md:top-1/3 md:transform md:-translate-y-1/2"
					>
						<h2 className="text-sm font-normal mt-4 mb-12">Round ID: #{currentRound?.id}</h2>
						<p className="text-sm text-[var(--text-gray)]">Game ends in:</p>
						<p className="text-4xl font-semibold">{formatTime(remainingTime)}</p>
					</motion.div>
				</AnimatePresence>
			) : isProcessingResult ? (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1.2 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3, stiffness: 500 }}
						className="absolute w-full flex flex-col items-center justify-center text-center text-white z-20 top-1/2 transform -translate-y-1/2"
					>
						<p className="text-lg font-semibold">Processing result...</p>
					</motion.div>
				</AnimatePresence>
			) : (
				isFetchingResult && (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1.2 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.3, stiffness: 500 }}
							className="absolute w-full flex flex-col items-center justify-center text-center text-white z-20 top-1/2 transform -translate-y-1/2"
						>
							<p className="text-lg font-semibold">Waiting for result...</p>
						</motion.div>
					</AnimatePresence>
				)
			)}

			{/* Winner message with animation */}
			<AnimatePresence>
				{showWinnerMessage && (
					<motion.div
						key="winnerMessage"
						className="absolute w-full flex flex-col items-center justify-center text-center text-white z-20 top-1/2 transform -translate-y-1/2 text-5xl"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1.2 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3, stiffness: 500 }}
					>
						{winningAmount > 0 ? (
							<>
								<h2 className="font-semibold z-30 text-white text-2xl">You won:</h2>
								<span className="font-semibold flex items-center gap-x-1 z-30 text-[var(--yellow)] text-2xl tabular-nums">
									{winningAmount.toLocaleString()} <img src={cashIcon} className="h-6" alt="" />
								</span>
								<div className="absolute h-40 w-40 rounded-full blur-xl opacity-70 bg-[var(--blue-shiny)] z-10" />
							</>
						) : (
							<h2 className="font-semibold z-30 text-white text-2xl">No winnings this time.</h2>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Wheel;
