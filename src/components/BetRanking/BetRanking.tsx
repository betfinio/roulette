import avatarImage from '../../assets/BetHistory/fox.svg';
import bronzeTrophy from '../../assets/BetHistory/trophy-bronze.svg';
import goldTrophy from '../../assets/BetHistory/trophy-gold.svg';
import silverTrophy from '../../assets/BetHistory/trophy-silver.svg';
import figureImage from '../../assets/BetRanking/affiliate.png';
import userIcon from '../../assets/BetRanking/user.svg';
import cashBlueIcon from '../../assets/BetTable/cash-blue.svg';
import crystalImage from '../../assets/Roulette/crystal1.svg';
import chipBetfinIcon from '../../assets/images/chip-betfin.svg';
import mockBetRankingData from '../../mocks/mockBetRanking.json';

const BetRanking = () => {
	const { victoryDetails, ranking } = mockBetRankingData;

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

	return (
		<div className="flex flex-col md:flex-row w-full space-x-2 items-center justify-around mt-16 mb-8 px-2 gap-16">
			{/* Left Side */}
			<div className="flex w-full max-w-[var(--min-width-sm)] h-full items-center justify-around rounded-xl border-2 border-[var(--yellow)]">
				<div className="flex flex-col justify-center items-center space-y-2">
					<div className="flex flex-col w-full items-center space-y-2">
						<img src={crystalImage} alt="Crystal" className="h-12" />
						<div className="flex flex-col items-center">
							<span className="flex flex-col items-center text-[var(--yellow)] text-xs font-semibold">{victoryDetails.totalBets} Total bets</span>
							<div className="flex items-center text-[var(--text-gray)] text-xs font-semibold">
								<span className="mr-1">{victoryDetails.totalUsers} users</span>
								<img src={userIcon} alt="Users" className="h-3" />
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex w-full items-center justify-center text-white text-2xl font-bold">WIN!</div>
						<div className="flex items-center w-full text-[var(--yellow)] font-bold">
							<span className="text-xl">{victoryDetails.winAmount}</span>
							<img src={chipBetfinIcon} alt="Cash" className="h-5 ml-1" />
						</div>
						<div className="text-[var(--blue)] flex items-center justify-center text-xs mt-1 font-semibold">{victoryDetails.bonusAmount} BONUS</div>
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
					<div className="w-[22%]">To be won</div>
					<div className="w-[22%]">Bonus</div>
				</div>

				{/* Rows */}
				{ranking.map((row, index) => (
					<div
						key={index}
						className={`flex items-center h-10 px-4 rounded-lg   relative overflow-hidden ${
							row.badge === 'gold'
								? 'bg-gradient-to-r from-[var(--gold)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(255,223,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
								: row.badge === 'silver'
									? 'bg-gradient-to-r from-[var(--silver)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(192,192,192,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
									: row.badge === 'bronze'
										? 'bg-gradient-to-r from-[var(--bronze)] via-[#131624] to-transparent shadow-[inset_0_0_0_1px_rgba(205,127,50,0.6),inset_0_0_0_1px_rgba(0,0,0,0.4)]'
										: index % 2 === 0
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
							<span className="text-xs">{row.player}</span>
						</div>
						<div className="flex items-center w-1/5 text-[var(--yellow)] font-semibold">
							<span className="text-xs">{row.toBeWon}</span>
							<img src={chipBetfinIcon} alt="Cash" className="h-4 ml-2" />
						</div>
						<div className="flex items-center w-1/5 text-[var(--blue)] font-semibold">
							<span className="text-xs">{row.bonus}</span>
							<img src={cashBlueIcon} alt="Cash Blue" className="h-4 ml-2" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default BetRanking;
