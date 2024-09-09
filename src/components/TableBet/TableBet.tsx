import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import arrowDown from '../../assets/BetTable/arrow-down.svg';
import showIcon from '../../assets/BetTable/eye.svg';
import searchIcon from '../../assets/BetTable/search.svg';
import sortIcon from '../../assets/BetTable/sort.svg';
import cashYellow from '../../assets/images/chip-betfin.svg';
import coinGreen from '../../assets/images/coin-green.svg';
import coinWhite from '../../assets/images/coin-white.svg';
import mockTableBet from '../../mocks/mockTableBet.json';

interface TableRow {
	date: string;
	round: string;
	sum: string;
	coin: string;
	winning: string;
	winNumber: string;
	transactionId: string;
	completed: boolean;
}

interface MockTableBet {
	myBets: TableRow[];
	allRounds: TableRow[];
}

const images: { [key: string]: string } = {
	coinWhite,
	coinGreen,
};

// Define colors based on European roulette
const getNumberColor = (num: string) => {
	const number = Number.parseInt(num, 10);
	if (Number.isNaN(number)) return null; // For timers or invalid numbers
	if (number === 0) return 'var(--green)';
	const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
	const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

	if (redNumbers.includes(number)) return 'var(--red)';
	if (blackNumbers.includes(number)) return 'var(--black)';
	return null;
};

const TableBet = () => {
	const [activeTab, setActiveTab] = useState<keyof MockTableBet>('myBets');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const [resultsPerPage, setResultsPerPage] = useState(10);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const data = mockTableBet[activeTab as keyof MockTableBet];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		const handleScroll = () => {
			setIsDropdownOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('scroll', handleScroll);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleSort = () => {
		setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleResultsPerPageChange = (limit: number) => {
		setResultsPerPage(limit);
		setCurrentPage(1); // Reset to first page on limit change
		setIsDropdownOpen(false);
	};

	// Filter and sort data based on searchTerm and sortOrder
	const filteredData = data.filter((row) => row.round.toLowerCase().includes(searchTerm.toLowerCase()));

	const sortedData = [...filteredData].sort((a, b) => {
		const valueA = sortOrder === 'asc' ? a.date : b.date;
		const valueB = sortOrder === 'asc' ? b.date : a.date;
		return valueA.localeCompare(valueB);
	});

	// Paginate data
	const indexOfLastResult = currentPage * resultsPerPage;
	const indexOfFirstResult = indexOfLastResult - resultsPerPage;
	const currentData = sortedData.slice(indexOfFirstResult, indexOfLastResult);

	// Calculate total pages
	const totalPages = Math.ceil(filteredData.length / resultsPerPage);

	// Helper function to render pagination buttons intelligently
	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxButtons = 5;

		if (totalPages <= maxButtons) {
			// Show all pages if total pages is less than or equal to max buttons
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			if (currentPage <= 3) {
				// Show first few pages and last page with ellipses
				pageNumbers.push(1, 2, 3, 4, '...', totalPages);
			} else if (currentPage > totalPages - 3) {
				// Show first page with ellipses and last few pages
				pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
			} else {
				// Show first page, ellipses, current page, ellipses, and last page
				pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
			}
		}

		return pageNumbers.map((page, index) => (
			<motion.button
				key={index}
				onClick={() => handlePageChange(page as number)}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className={`px-2 py-2 w-8 rounded-md text-xs font-semibold border-[1px] border-[var(--border-primary)] ${
					currentPage === page ? 'bg-[hsl(var(--bg-primary))] text-[var(--white)]' : 'bg-[var(bg-primary)] text-[var(--text-grey)]'
				} ${typeof page === 'string' ? 'cursor-default' : 'cursor-pointer'}`}
				disabled={typeof page === 'string'}
			>
				{page}
			</motion.button>
		));
	};

	return (
		<div className="w-full mt-6 overflow-hidden">
			{/* Tabs */}
			<div className="flex space-x-4 mb-4">
				<button
					type="button"
					className={`px-4 py-2 rounded-lg font-semibold text-xs ${
						activeTab === 'myBets' ? 'bg-[var(--yellow)] text-[var(--black)]' : 'bg-[var(--bg-sec)] text-[var(--text-gray)]'
					}`}
					onClick={() => setActiveTab('myBets')}
				>
					My bets
				</button>
				<button
					type="button"
					className={`px-4 py-2 rounded-lg font-semibold text-xs ${
						activeTab === 'allRounds' ? 'bg-[var(--yellow)] text-[var(--black)]' : 'bg-[var(--bg-sec)] text-[var(--text-gray)]'
					}`}
					onClick={() => setActiveTab('allRounds')}
				>
					All rounds
				</button>
				<div className="flex w-full  max-w-36 items-center bg-[var(--bg-sec)] rounded-lg">
					<img src={searchIcon} alt="search" className="h-4 w-4 mx-2" />
					<input
						type="text"
						placeholder="Search round"
						className="bg-transparent text-white text-sm outline-none"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Pagination and Results Per Page */}
			<div className="flex flex-wrap justify-between items-center space-y-2 md:space-y-0 mt-4">
				<div className="flex items-center space-x-2">
					<span className="text-[var(--text-gray)] text-sm">Pages:</span>
					{renderPageNumbers()}
				</div>
				{/* Order results */}
				<div className="flex items-center space-x-2">
					<span className="text-[var(--text-gray)] text-sm">Sort by:</span>
					<motion.img
						src={sortIcon}
						alt="sort"
						className="h-4 w-4 cursor-pointer hover:scale-150 transition-all"
						onClick={handleSort}
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					/>
				</div>
				<div
					ref={dropdownRef}
					className="relative flex items-center justify-between space-x-2 border-[var(--bg-sec)] border-2 p-2 rounded-lg cursor-pointer w-28"
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					<img src={showIcon} alt="show" className="h-4 w-4" />
					<span className="text-[#6A6F84] font-semibold text-xs">Show</span>
					<span className="text-[#6A6F84] font-semibold text-xs">{resultsPerPage}</span>
					<img src={arrowDown} alt="arrow-down" className="h-4 w-4" />
					<AnimatePresence>
						{isDropdownOpen && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="absolute w-24 top-[100%] left-0 mt-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg z-50 font-semibold text-xs"
							>
								{[10, 20, 50].map((limit) => (
									<div key={limit} className="px-4 py-2 cursor-pointer hover:bg-[var(--bg-sec)] text-white" onClick={() => handleResultsPerPageChange(limit)}>
										Show {limit}
									</div>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Table Content */}
			<motion.div
				key={activeTab}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="rounded-lg overflow-hidden"
			>
				<div className="overflow-hidden">
					<table className="w-full text-white table-auto" style={{ minWidth: 'var(--min-width-sm)' }}>
						<thead>
							<tr className="text-[var(--text-gray)] text-xs whitespace-nowrap">
								<th className="text-left py-4 w-[28%]">Round ID</th>
								<th className="text-left py-4 w-[22%]">BET-SUM</th>
								<th className="text-left py-4 w-[24%]">Win number</th>
								<th className="text-left py-4 w-[26%]">Staking change</th>
							</tr>
						</thead>
						<motion.tbody
							initial="hidden"
							animate="visible"
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.1,
									},
								},
							}}
						>
							{currentData.map((row, index) => (
								<motion.tr
									key={index}
									className={`${index % 2 === 0 ? 'bg-[var(--bg-sec)]' : ''} hover:bg-[var(--bg-primary)] transition-all duration-300`}
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<td className="py-4 pl-4 rounded-tl-xl rounded-bl-xl text-xs font-semibold text-[var(--text-gray)] tabular-nums">{row.transactionId}</td>
									<td className="py-4">
										<div className="flex items-center space-x-1 text-white text-xs tabular-nums font-semibold">
											<span>{row.sum}</span>
											<img src={images[row.coin]} alt="coin" className="h-6" />
										</div>
									</td>
									<td className="py-4 px-2 text-center">
										{row.winNumber.includes(':') ? (
											<span className="text-xs font-semibold tabular-nums">{row.winNumber}</span>
										) : (
											<span
												className="text-xs px-4 py-1 rounded-md font-semibold tabular-nums"
												style={{
													color: 'white',
													backgroundColor: getNumberColor(row.winNumber) || undefined,
												}}
											>
												{row.winNumber}
											</span>
										)}
									</td>
									<td className="py-4 pr-4 rounded-tr-xl rounded-br-xl text-center">
										<div className="flex items-center space-x-2 text-[var(--yellow)] text-xs font-semibold tabular-nums">
											<span>200</span>
											<img src={cashYellow} alt="cash" className="h-6" />
											<a href="https://polygonscan.com/tx/0x12345" target="_blank" rel="noopener noreferrer">
												<FaExternalLinkAlt color="var(--text-gray)" className="h-3" />
											</a>
										</div>
									</td>
								</motion.tr>
							))}
						</motion.tbody>
					</table>
				</div>
			</motion.div>
		</div>
	);
};

export default TableBet;
