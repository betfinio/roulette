import { useGetLiveRouletteTableStats, useGetTableRounds } from '@/src/lib/live-roulette/query';
import { useGetTableAddress } from '@/src/lib/shared/query';
import { Stat } from '../shared/Stat/Stat';

export const TableStat = () => {
	const { tableAddress } = useGetTableAddress();

	const { data: tableStat, isLoading: isStatLoading } = useGetLiveRouletteTableStats(tableAddress);
	return <Stat tableOrPlayerStat={tableStat} isLoading={isStatLoading} />;
};
