import { useGetSelectedRound, useGetTableAddress, useGetTableSelectedRoundBets } from '@/src/lib/roulette/query';
import { BetItem } from './BetTabItem';

export const BetsTab = () => {
	const { tableAddress } = useGetTableAddress();
	const round = useGetSelectedRound() || 0;
	const { data = [] } = useGetTableSelectedRoundBets(tableAddress, round);
	return (
		<div className="flex flex-col gap-2">
			{data.map((bet) => {
				return <BetItem key={bet.bet} bet={bet} round={round} />;
			})}
		</div>
	);
};
