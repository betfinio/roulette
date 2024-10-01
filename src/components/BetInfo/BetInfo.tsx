import playersIcon from '../../assets/BetRanking/user.svg';
import cashIcon from '../../assets/images/cash-icon.svg';

export const BetInfo = () => {
	const mockData = {
		totalBets: '35.5k',
		totalPlayers: 12,
		potentialWin: {
			amount: '12.8k',
			multiplier: 3.96,
		},
	};

	return (
		<div className="flex flex-col justify-center items-center space-y-3 w-full mt-4 p-4 gap-x-4 bg-[var(--bg-sec)] border-[var(--border-primary)] border-default box-border rounded-lg text-sm">
			<span className="text-[var(--text-gray)] font-medium">ALL BETS in round #2434</span>
			<div className="flex gap-x-4">
				<div className="flex flex-col w-full py-3 items-center justify-center text-[var(--text-gray)] bg-[var(--bg-darker)] rounded-lg">
					<div className="flex items-center justify-center w-[120px] space-x-1">
						<span className="text-[var(--yellow)] text-md font-semibold tabular-nums">{mockData.totalBets}</span>
						<img src={cashIcon} className="h-3 w-3" alt="" />
					</div>
				</div>
				<div className="flex px-4 gap-x-1 w-full py-3 items-center justify-center text-[var(--yellow)] bg-[var(--bg-darker)] rounded-lg">
					<span className=" text-md font-semibold tabular-nums">{mockData.totalPlayers}</span>
					<span>players</span>
					<img src={playersIcon} className="h-3 w-3" alt="" />
				</div>
			</div>
		</div>
	);
};
