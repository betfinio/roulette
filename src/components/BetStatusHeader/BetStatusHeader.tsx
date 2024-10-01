import { useWheel } from '@/src/contexts/WheelContext';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import externalLink from '../../assets/BetHistory/external-link.svg';
import holdCash from '../../assets/BetStatusHeader/hold-cash.svg';
import infoIcon from '../../assets/BetStatusHeader/info.svg';
import questionIcon from '../../assets/BetStatusHeader/question.svg';
import supportIcon from '../../assets/BetStatusHeader/support.svg';

const BetStatusHeader: React.FC = () => {
	const { isVertical } = useWheel();
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

	if (!isVertical) {
		return (
			<div className="flex items-center mx-auto h-20 justify-between bg-[var(--bg-sec)] w-full max-w-4xl px-8 py-2 text-white border-2 border-[var(--border-primary)] rounded-lg">
				{/* Grupo 1: Bank */}
				<div className="flex items-center w-fit">
					<img src={holdCash} alt="Money bag icon" className="h-8" />
					<div className="flex flex-col items-start ml-2">
						<div className="flex items-center">
							<p className="capitalize text-sm font-light">Bank</p>
							<img src={externalLink} alt="External link icon" className="ml-1 w-3 h-3 cursor-pointer" />
						</div>
						<p className="font-semibold text-xs tabular-nums">500k BET</p>
					</div>
				</div>

				{/* Grupo 2: Payout Limit, My Bets, Expected Win */}
				<div className="flex items-center space-around w-fit gap-x-4">
					{/* Primeira coluna: Payout limit */}
					<div className="flex flex-col text-left">
						<p className="capitalize text-sm font-light">Payout limit</p>
						<p className="font-semibold text-xs tabular-nums">896k (86%)</p>
					</div>

					{/* Separador vertical entre as colunas do grupo do meio */}
					<div className="border-l border-white h-8 mx-2" />

					{/* Segunda coluna: My bets */}
					<div className="flex flex-col text-left">
						<p className="capitalize text-sm font-light">My bets</p>
						<p className="font-semibold text-xs tabular-nums">500 000 BET</p>
					</div>

					{/* Separador vertical */}
					<div className="border-l border-white h-8 mx-2" />

					{/* Terceira coluna: Expected win */}
					<div className="flex flex-col text-left">
						<p className="capitalize text-sm font-light text-[var(--yellow)]">Expected win</p>
						<p className="font-semibold text-xs text-[var(--yellow)] tabular-nums">950 000 BET</p>
					</div>
				</div>

				{/* Grupo 3: Paytable, How to Play, Report */}
				<div className="flex items-center space-around w-fit gap-x-6 text-nowrap">
					{/* Primeira coluna: Paytable */}
					<div className="flex flex-col items-center cursor-pointer">
						<img src={infoIcon} alt="Info icon" className="w-5 h-5" />
						<p className="capitalize text-center font-light">Paytable</p>
					</div>

					{/* Segunda coluna: How to play */}
					<div className="flex flex-col items-center cursor-pointer">
						<img src={questionIcon} alt="Question icon" className="w-5 h-5" />
						<p className="capitalize text-center font-light">How to play</p>
					</div>

					{/* Terceira coluna: Report */}
					<div className="flex flex-col items-center cursor-pointer">
						<img src={supportIcon} alt="Support icon" className="w-5 h-5" />
						<p className="capitalize text-center font-light">Report</p>
					</div>
				</div>
			</div>
		);
	}

	if (isVertical) {
		return (
			<div ref={containerRef} className="w-full" id="top">
				<div
					className={clsx(
						'bg-[var(--bg-sec)] max-w-sm mx-auto border-default border-[var(--border-primary)] text-white p-4 rounded-lg flex justify-between items-center cursor-pointer relative z-10 transition-all',
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
							className="absolute top-full left-0 w-full text-white rounded-b-lg overflow-hidden z-30"
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
										<img src={infoIcon} alt="" />
										<p>Paytable</p>
									</div>
									<div className="flex items-center gap-x-2">
										<img src={questionIcon} alt="" />
										<p>How to play</p>
									</div>
									<div className="flex items-center gap-x-2">
										<img src={supportIcon} alt="" />
										<p>Report</p>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
};

export default BetStatusHeader;
