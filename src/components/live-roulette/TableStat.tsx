import { useGetMPEndedRounds, useGetTableAddress } from '@/src/lib/roulette/query';
import { Stat } from '../shared/Stat/Stat';

export const TableStat = () => {
	const { tableAddress } = useGetTableAddress();
	const { data: bets = [] } = useGetMPEndedRounds(tableAddress);

	return <Stat bets={bets} />;
};
