import { useGetSelectedRound, useGetTableAddress, useGetTableSelectedRoundBets } from '@/src/lib/roulette/query';
import { BetItem } from './BetTabItem';

export const BetsTab = () => {
	const { tableAddress } = useGetTableAddress();
	const { round = 0 } = useGetSelectedRound();
	const { data = [] } = useGetTableSelectedRoundBets(tableAddress, round);

	console.log(round, 'round');
	return (
		<div className="flex flex-col gap-2">
			{data.map((bet) => {
				return <BetItem key={bet.bet} bet={bet} round={round} />;
			})}
		</div>
	);
};
