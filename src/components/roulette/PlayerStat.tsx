import { useGetPlayerBets, useGetTableAddress } from '@/src/lib/roulette/query';
import { Stat } from '../shared/Stat/Stat';

export const PlayerStat = () => {
	const { tableAddress } = useGetTableAddress();
	const { data: bets = [] } = useGetPlayerBets(tableAddress);

	return <Stat bets={bets} />;
};
