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
		<div className="flex justify-between w-full mt-4 p-4 gap-x-4 bg-[var(--bg-sec)] border-[var(--border-primary)] border-[1px] box-border rounded-lg text-sm">
			<div className="flex flex-col py-3 items-center justify-center text-[var(--text-gray)] w-1/2 bg-[var(--bg-darker)] rounded-lg">
				<span className="text-[var(--text-gray)] h-6">Total BETs</span>
				<div className="flex items-center justify-between w-[120px] space-x-1">
					<span className="text-[var(--yellow)] text-md font-semibold">{mockData.totalBets}</span>
					<span className="text-white text-md font-semibold">{mockData.totalPlayers}</span>
				</div>
			</div>
			<div className="flex flex-col py-3 items-center justify-center text-[var(--text-gray)] w-1/2 bg-[var(--bg-darker)] rounded-lg">
				<span className="text-[var(--text-gray)] h-6">Potential win</span>
				<div className="flex items-center space-x-1">
					<span className="text-[var(--yellow)] text-md font-semibold">{mockData.potentialWin.amount}</span>
					<span className="text-[var(--yellow)] text-md font-semibold">({mockData.potentialWin.multiplier}x)</span>
				</div>
			</div>
		</div>
	);
};
