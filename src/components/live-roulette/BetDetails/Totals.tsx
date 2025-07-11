import { BetValue } from '@betfinio/components/shared';
import { UserIcon } from 'lucide-react';
import { useGetSelectedRound, useGetTableRoundPlayers, useGetTableSelectedRoundBets } from '@/src/lib/live-roulette/query';
import { useVisibleTable } from '@/src/lib/shared/query';

export const Totals = () => {
	const { table } = useVisibleTable();
	const { round = 0 } = useGetSelectedRound();
	const { data = [] } = useGetTableSelectedRoundBets(table, round);
	const totalBets = data.reduce((acc, bet) => acc + bet.amount, 0n);
	const { data: players = [] } = useGetTableRoundPlayers(table, round);
	const totalPlayers = players.length;
	return (
		<div className="rl:bg-card rl:p-4 rl:flex rl:justify-between rl:border rl:border-border rl:rounded-lg">
			<div>
				<div className="rl:font-semibold text-primary">
					<BetValue withIcon value={totalBets} />
				</div>
			</div>
			<div>
				<div className="rl:font-semibold rl:flex rl:gap-1 rl:justify-center rl:items-center rl:text-success">
					{totalPlayers}
					<UserIcon className={'rl:h-4 rl:w-4'} />
				</div>
			</div>
		</div>
	);
};
