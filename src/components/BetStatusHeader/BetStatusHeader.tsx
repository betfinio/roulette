import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaExclamationTriangle, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

const BetStatusHeader: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
			setIsExpanded(false);
		}
	};

	const handleScroll = () => {
		setIsExpanded(false);
	};

	useEffect(() => {
		if (isExpanded) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isExpanded]);

	return (
		<div ref={containerRef} className="w-full" id="top">
			<div
				className={clsx(
					'bg-[var(--bg-sec)] max-w-sm mx-auto border-[1px] border-[var(--border-primary)] text-white p-4 rounded-lg flex justify-between items-center cursor-pointer relative z-10 transition-all',
					{
						'rounded-b-none': isExpanded,
					},
				)}
				onClick={toggleExpand}
			>
				<div>
					<p>My bets</p>
					<p className="font-bold">500k BET</p>
				</div>
				<div>
					<p>Potential win</p>
					<p className="font-bold">1 000k BET</p>
				</div>
				<motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
					<FaChevronDown />
				</motion.div>
			</div>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: '0' }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: '0' }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className="absolute top-full left-0 w-full text-white rounded-b-lg overflow-hidden z-10"
					>
						<div className="flex items-center justify-between h-full max-w-sm mx-auto bg-[var(--bg-sec)] rounded-b-md px-4 py-2">
							<div className="space-y-2">
								<div>
									<p>Balance</p>
									<p className="font-bold">500 000 BET</p>
								</div>
								<div>
									<p>Total bet</p>
									<p className="font-bold">500 000 BET</p>
								</div>
								<div>
									<p className="text-[var(--yellow)]">Win</p>
									<p className="font-bold text-[var(--yellow)]">300,000 BET</p>
								</div>
							</div>
							<div className="space-y-8 justify-around max-w-36 flex flex-col">
								<div className="flex items-center gap-x-2">
									<FaInfoCircle className="text-xl" />
									<p>Paytable</p>
								</div>
								<div className="flex items-center gap-x-2">
									<FaQuestionCircle className="text-xl" />
									<p>How to play</p>
								</div>
								<div className="flex items-center gap-x-2">
									<FaExclamationTriangle className="text-xl" />
									<p>Report</p>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default BetStatusHeader;
