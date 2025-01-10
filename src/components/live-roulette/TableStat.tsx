import { useGetTableRounds } from '@/src/lib/live-roulette/query';
import { useGetTableAddress } from '@/src/lib/shared/query';
import { Stat } from '../shared/Stat/Stat';

export const TableStat = () => {
	const { tableAddress } = useGetTableAddress();
	const { data: bets = [], isFetched: isBetsFetched } = useGetTableRounds(7, tableAddress);

	return <Stat winNumbers={bets.map((bet) => bet.winNumber)} />;
};
