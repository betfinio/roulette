import { useGetPlayerBets } from '@/src/lib/roulette/query';
import { useGetTableAddress } from '@/src/lib/shared/query';
import { Stat } from '../shared/Stat/Stat';

export const PlayerStat = () => {
	const { tableAddress } = useGetTableAddress();
	const { data: bets = [] } = useGetPlayerBets(tableAddress);

	return <Stat winNumbers={bets.map((bet) => bet.winNumber)} />;
};
