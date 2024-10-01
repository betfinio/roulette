import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import avatarImage from '../../assets/BetHistory/fox.svg';
import bronzeTrophy from '../../assets/BetHistory/trophy-bronze.svg';
import goldTrophy from '../../assets/BetHistory/trophy-gold.svg';
import silverTrophy from '../../assets/BetHistory/trophy-silver.svg';
import figureImage from '../../assets/BetRanking/affiliate.png';
import userIcon from '../../assets/BetRanking/user.svg';
import crystalImage from '../../assets/Roulette/crystal1.svg';
import chipBetfinIcon from '../../assets/images/chip-betfin.svg';

// Define types for Bet and PlayerRanking
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

type PlayerRanking = {
	player: string;
	nickname: string;
	address: string;
	totalAmount: number;
	position: number;
	badge?: 'gold' | 'silver' | 'bronze';
};

const BetRanking = () => {
	const [bets, setBets] = useState<Bet[]>([]);
	const [playerRankings, setPlayerRankings] = useState<PlayerRanking[]>([]);
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
				setBets((prevBets) => [...prevBets, newBet]);
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

	// Calculate player rankings whenever bets change
	useEffect(() => {
		const playerTotals: { [key: string]: PlayerRanking } = {};

		// biome-ignore lint/complexity/noForEach: <explanation>
		bets.forEach((bet) => {
			if (playerTotals[bet.nickname]) {
				playerTotals[bet.nickname].totalAmount += bet.totalAmount;
			} else {
				playerTotals[bet.nickname] = {
					player: bet.nickname,
					nickname: bet.nickname,
					address: bet.address,
					totalAmount: bet.totalAmount,
					position: 0,
				};
			}
		});

		const rankings = Object.values(playerTotals)
			.sort((a, b) => b.totalAmount - a.totalAmount)
			.map((player, index) => {
				let badge: 'gold' | 'silver' | 'bronze' | undefined;
				if (index === 0) badge = 'gold';
				else if (index === 1) badge = 'silver';
				else if (index === 2) badge = 'bronze';

				return {
					...player,
					position: index + 1,
					badge,
				};
			});

		setPlayerRankings(rankings);
	}, [bets]);

	const trophyImages: { [key: string]: string } = {
		gold: goldTrophy,
		silver: silverTrophy,
		bronze: bronzeTrophy,
	};

	const getTrophyImage = (badge: string | undefined): string | undefined => {
		if (badge && trophyImages[badge]) {
			return trophyImages[badge];
		}
		return undefined;
	};

	const totalBets = bets.length;
	const totalUsers = playerRankings.length;

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

	return (
		<div className="flex flex-col md:flex-row w-full space-x-2 items-center justify-around mt-16 mb-8 px-2 gap-16">
			{/* Left Side */}
			<div className="flex w-full h-full items-center justify-around rounded-xl border-2 border-[var(--yellow)]">
				<div className="flex flex-col justify-center items-center space-y-2">
					<div className="flex flex-col w-full items-center space-y-2">
						<img src={crystalImage} alt="Crystal" className="h-12" />
						<div className="flex flex-col items-center">
							<span className="flex flex-col items-center text-[var(--yellow)] text-xs font-semibold">{totalBets} Total bets</span>
							<div className="flex items-center text-[var(--text-gray)] text-xs font-semibold">
								<span className="mr-1">{totalUsers} users</span>
								<img src={userIcon} alt="Users" className="h-3" />
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex w-full items-center justify-center text-white text-2xl font-bold">BET RANKING</div>
					</div>
				</div>
				<img src={figureImage} alt="Figure" className="h-56 w-32" />
			</div>

			{/* Right Side - Ranking List */}
			<div className="w-full flex flex-col space-y-2">
				{/* Header */}
				<div className="flex justify-between text-[var(--text-gray)] text-xs px-4 py-2">
					<div className="w-[25%]">№</div>
					<div className="w-[43%]">Players</div>
					<div className="w-[22%]">Total Bet</div>
				</div>

				{/* Rows */}
				<div className="relative">
					<AnimatePresence>
						{playerRankings.map((row) => (
							<motion.div
								key={row.nickname}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
								className={`flex items-center h-10 px-4 rounded-lg relative overflow-hidden ${
									row.badge === 'gold'
										? 'bg-gradient-to-r from-[var(--gold)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(255,223,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
										: row.badge === 'silver'
											? 'bg-gradient-to-r from-[var(--silver)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(192,192,192,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
											: row.badge === 'bronze'
												? 'bg-gradient-to-r from-[var(--bronze)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(205,127,50,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
												: playerRankings.indexOf(row) % 2 === 0
													? 'bg-[var(--black)]'
													: 'bg-transparent'
								} hover:bg-[#282c46] transition-all duration-300`}
							>
								<div className="flex items-center w-[25%]">
									<span className="mr-2 text-xs">#{row.position}</span>
									{getTrophyImage(row.badge) && <img src={getTrophyImage(row.badge) as string} alt={row.badge} className="h-4 inline-block mr-2" />}
								</div>
								<div className="flex items-center w-5/12 space-x-2">
									<img src={avatarImage} alt={`Avatar of ${row.player}`} className="h-5" />
									<span className="text-xs">{row.player.replace(/(.{5}).*(.{4})/, '$1...$2')}</span>
								</div>
								<div className="flex items-center w-1/5 text-[var(--yellow)] font-semibold">
									<span className="text-xs">{row.totalAmount}</span>
									<img src={chipBetfinIcon} alt="Cash" className="h-4 ml-2" />
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

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
	const response = await fetch(`http://localhost:7777/api/bets/${roundId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch bets for current round');
	}
	const data: Bet[] = await response.json();
	return data;
}

export default BetRanking;
