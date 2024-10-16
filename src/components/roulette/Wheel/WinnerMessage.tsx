import { AnimatePresence, motion } from 'framer-motion';

import cashIcon from '../../../assets/images/chip-betfin.svg';

export const WinnerMessage = () => {
	const showWinnerMessage = false;
	const winningAmount = 0;
	return (
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
	);
};
