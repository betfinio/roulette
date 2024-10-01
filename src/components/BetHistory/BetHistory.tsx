import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import externalLinkImg from '../../assets/BetHistory/external-link.svg';
import foxIcon from '../../assets/BetHistory/fox.svg';
import bronze_trophy from '../../assets/BetHistory/trophy-bronze.svg';
import gold_trophy from '../../assets/BetHistory/trophy-gold.svg';
import silver_trophy from '../../assets/BetHistory/trophy-silver.svg';
import chipBetfinIcon from '../../assets/images/chip-betfin.svg';
import { BetInfo } from '../BetInfo/BetInfo';

// Icons for trophies and chips
const icons: { [key: string]: string } = {
	gold_trophy,
	silver_trophy,
	bronze_trophy,
	chipBetfinIcon,
};

// Data types
type Bet = {
	id: string;
	roundId: string;
	nickname: string;
	address: string;
	chips: number;
	chipValue: number;
	totalAmount: number;
	betType: string;
	numbers: string[];
	payout: number;
	timestamp: string;
	amountWon?: number;
};

type Round = {
	id: string;
	startTime: string;
	endTime: string;
	status: 'waiting' | 'completed';
	// other fields
};

type PlayerData = {
	id: string;
	nickname: string;
	address: string;
	bets: number;
	amount: number;
	trophy?: string;
};

type BetData = {
	id: string;
	nickname: string;
	address: string;
	amount: number;
	betType: string;
	numbers: string[];
	trophy?: string;
};

// The BetHistory component maintains tabs and display structure
const BetHistory = () => {
	const [activeTab, setActiveTab] = useState<'players' | 'bets'>('bets');
	const [bets, setBets] = useState<Bet[]>([]);
	const [playerData, setPlayerData] = useState<PlayerData[]>([]);
	const [betData, setBetData] = useState<BetData[]>([]);
	const [currentRoundId, setCurrentRoundId] = useState<string | null>(null);

	// Fetch current round using React Query
	const {
		data: currentRound,
		isLoading: isLoadingRound,
		error: errorRound,
	} = useQuery<Round>('currentRound', fetchCurrentRound, {
		refetchInterval: 1000, // Refetch every second to detect round changes
		refetchOnWindowFocus: false,
	});

	// Update currentRoundId when currentRound is fetched
	useEffect(() => {
		if (currentRound) {
			setCurrentRoundId(currentRound.id);
		} else {
			setCurrentRoundId(null);
		}
	}, [currentRound]);

	// Fetch bets for current round using React Query
	const {
		data: betsData,
		isLoading: isLoadingBets,
		error: errorBets,
	} = useQuery<Bet[]>(
		['bets', currentRoundId],
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		() => fetchBetsForRound(currentRoundId!),
		{
			enabled: !!currentRoundId, // Only fetch when currentRoundId is available
			refetchOnWindowFocus: false,
		},
	);

	// Update bets state when data is fetched
	useEffect(() => {
		if (betsData) {
			setBets(betsData);
		} else {
			setBets([]);
		}
	}, [betsData]);

	// Subscribe to new bet events via Server-Sent Events
	useEffect(() => {
		if (!currentRoundId) return;

		const eventSource = new EventSource('http://localhost:7777/api/betUpdates');

		eventSource.onmessage = (event) => {
			const newBet: Bet = JSON.parse(event.data);
			// Only add the bet if it's for the current round
			if (newBet.roundId === currentRoundId) {
				setBets((prevBets) => [newBet, ...prevBets]);
			}
		};

		eventSource.onerror = (err) => {
			console.error('EventSource failed:', err);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, [currentRoundId]);

	// Process bets to extract player data and bet data
	useEffect(() => {
		// Aggregate player data
		const playerMap: { [key: string]: PlayerData } = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		bets.forEach((bet) => {
			if (playerMap[bet.nickname]) {
				playerMap[bet.nickname].bets += 1;
				playerMap[bet.nickname].amount += bet.totalAmount;
			} else {
				playerMap[bet.nickname] = {
					id: bet.id,
					nickname: bet.nickname,
					address: bet.address,
					bets: 1,
					amount: bet.totalAmount,
				};
			}
		});

		// Assign trophies to top players
		const players = Object.values(playerMap)
			.sort((a, b) => b.amount - a.amount)
			.map((player, index) => {
				let trophy: string | undefined;
				if (index === 0) trophy = 'gold_trophy';
				else if (index === 1) trophy = 'silver_trophy';
				else if (index === 2) trophy = 'bronze_trophy';
				return { ...player, trophy };
			});

		setPlayerData(players);

		// Prepare bet data
		const betsList = bets.map((bet) => ({
			id: bet.id,
			nickname: bet.nickname,
			address: bet.address,
			amount: bet.totalAmount,
			betType: bet.betType,
			numbers: bet.numbers,
			trophy: undefined,
		}));

		setBetData(betsList);
	}, [bets]);

	// Loading state
	if (isLoadingRound || isLoadingBets) {
		return (
			<div className="w-full flex justify-center items-center py-10">
				<div className="animate-pulse w-full h-full bg-gray-700 rounded-lg flex justify-center items-center p-4">
					<div className="text-gray-300">Loading...</div>
				</div>
			</div>
		);
	}

	// Error state
	if (errorRound || errorBets) {
		return (
			<div className="w-full flex justify-center items-center py-10">
				<div className="bg-red-500 text-white p-4 rounded-lg">Failed to load bets. Please try again later.</div>
			</div>
		);
	}

	// Determine data based on active tab
	const data = activeTab === 'players' ? playerData : betData;

	return (
		<div className="w-full overflow-hidden rounded-lg mt-3">
			{/* Tabs */}
			<div className="flex justify-center space-x-4 mb-4 w-full">
				{['Players', 'Bets'].map((tab) => (
					<button
						type="button"
						key={tab}
						className={`px-4 py-2 rounded-lg font-semibold text-xs border-default border-[var(--border-primary)] w-full ${
							activeTab === tab.toLowerCase() ? 'bg-[var(--yellow)] text-black' : 'bg-[var(--bg-sec)] text-slate-500'
						}`}
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						onClick={() => setActiveTab(tab.toLowerCase() as any)}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Bet list */}
			<div className="relative w-full h-[360px] md:h-[584px] bg-[var(--bg-sec)] border-[var(--border-primary)] border-default box-border rounded-lg p-4">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth rounded-lg"
					style={{
						paddingRight: '8px',
						scrollbarWidth: 'thin',
						scrollbarColor: 'var(--bg-primary) var(--bg-sec)',
					}}
				>
					<AnimatePresence>
						{data.map((item, index) => (
							<motion.div
								key={item.id}
								className={`flex items-center justify-between p-4 mb-2 rounded-xl border-2 ${
									index % 2 === 0 ? 'bg-[var(--bg-lighter)] border-[var(--border-primary)]' : 'bg-[var(--bg-sec)]'
								} ${
									item.trophy === 'gold_trophy'
										? 'border-[var(--gold)]'
										: item.trophy === 'silver_trophy'
											? 'border-[var(--silver)]'
											: item.trophy === 'bronze_trophy'
												? 'border-[var(--bronze)]'
												: 'border-transparent'
								}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2, delay: index * 0.1 }}
								style={{ width: '100%', height: '78px' }}
							>
								<div className="flex items-center space-x-4">
									<img src={foxIcon} alt="fox" className="h-[24px]" />
									<div className="flex flex-col w-fit pr-1">
										<span className="text-white text-xs font-bold flex items-center">
											{item.nickname.replace(/(.{5}).*(.{4})/, '$1..$2')}
											{item.trophy && <img src={icons[item.trophy]} alt="trophy" className="h-[16px] ml-2" />}
										</span>
										<a
											// biome-ignore lint/a11y/useValidAnchor: <explanation>
											href="#"
											className="block text-[var(--text-gray)] text-xs"
										>
											{item.address}
										</a>
									</div>
								</div>

								<div className="text-right">
									{activeTab === 'players' && 'bets' in item && (
										<div className="w-22">
											<div className="flex w-full items-center justify-end space-x-1 text-white font-semibold">
												<span className="text-xs opacity-100">{item.bets}</span>
												<span className="text-xs opacity-100">bets</span>
												<img src={externalLinkImg} alt="link" className="h-4 w-4" />
											</div>
											<div className="flex items-center">
												<span className="text-white text-xs font-semibold block whitespace-nowrap tabular-nums">{item.amount}</span>
												<img src={chipBetfinIcon} alt="icon" className="h-4 ml-1 inline-block" />
											</div>
										</div>
									)}
									{activeTab === 'bets' && 'betType' in item && (
										<div className="w-22">
											<div className="flex items-center justify-end space-x-1 text-yellow-500 font-semibold">
												<span className="text-xs opacity-100">{item.amount}</span>
												<img src={chipBetfinIcon} alt="icon" className="h-4 w-4 ml-1" />
											</div>
											<div className="flex items-center justify-end">
												<span className="text-white text-xs font-bold block whitespace-nowrap tabular-nums">
													{item.betType} ({item.numbers.join(', ')})
												</span>
											</div>
										</div>
									)}
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
				{/* Overlay gradient */}
				<div
					className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
					style={{
						background: 'linear-gradient(to bottom, transparent, transparent, hsl(229, 31%, 11%))',
					}}
				/>
			</div>
			<BetInfo />
		</div>
	);
};

export default BetHistory;

// Fetch current round from the API
async function fetchCurrentRound(): Promise<Round> {
	const response = await fetch('http://localhost:7777/api/currentRound');
	if (!response.ok) {
		throw new Error('Failed to fetch current round');
	}
	const data: Round = await response.json();
	return data;
}

// Fetch bets for a specific round
async function fetchBetsForRound(roundId: string): Promise<Bet[]> {
	const response = await fetch(`http://localhost:7777/api/bets/${roundId}?limit=50`);
	if (!response.ok) {
		throw new Error('Failed to fetch bets for current round');
	}
	const data: Bet[] = await response.json();
	return data;
}
