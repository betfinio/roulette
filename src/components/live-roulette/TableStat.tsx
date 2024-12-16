import { useGetTableBets } from '@/src/lib/roulette/query';
import { Stat } from '../shared/Stat/Stat';

export const TableStat = () => {
	const { data: bets = [], isFetched: isBetsFetched } = useGetTableBets();

	return <Stat bets={bets} />;
};
