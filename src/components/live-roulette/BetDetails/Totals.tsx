import { useGetSelectedRound, useGetTableRoundPlayers, useGetTableSelectedRoundBets } from '@/src/lib/live-roulette/query';
import { useVisibleTable } from '@/src/lib/shared/query';
import { BetValue } from '@betfinio/components/shared';
import { UserIcon } from 'lucide-react';

export const Totals = () => {
	const { table } = useVisibleTable();
	const { round = 0 } = useGetSelectedRound();
	const { data = [] } = useGetTableSelectedRoundBets(table, round);
	const totalBets = data.reduce((acc, bet) => acc + bet.amount, 0n);
	const { data: players = [] } = useGetTableRoundPlayers(table, round);
	const totalPlayers = players.length;
	return (
		<div className="bg-card p-4 flex justify-between border border-border rounded-lg    ">
			<div>
				<div className="font-semibold text-primary">
					<BetValue withIcon value={totalBets} />
				</div>
			</div>
			<div>
				<div className="font-semibold flex gap-1 justify-center items-center text-success">
					{totalPlayers}
					<UserIcon className={'h-4 w-4'} />
				</div>
			</div>
		</div>
	);
};
