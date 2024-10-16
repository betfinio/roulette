import { formatTime } from '@/src/lib/roulette';
import { AnimatePresence, motion } from 'framer-motion';

export const WheelStatus = () => {
	const isWheelWheelSpinning = false;
	const showWinnerMessage = false;
	const remainingTime = 0;
	const currentRound = { id: 1 };
	const isProcessingResult = false;
	const isFetchingResult = false;

	if (!isWheelWheelSpinning && !showWinnerMessage) {
		return (
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
		);
	}

	if (isProcessingResult) {
		return (
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
		);
	}

	if (isFetchingResult) {
		return (
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
		);
	}
	return null;
};
