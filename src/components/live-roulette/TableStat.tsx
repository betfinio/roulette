import { useLiveRouletteTableStats } from '@/src/lib/live-roulette/query';
import { useVisibleTable } from '@/src/lib/shared/query';
import { Stat } from '../shared/Stat/Stat';

export const TableStat = () => {
	const { table } = useVisibleTable();

	const { data: tableStat, isLoading: isStatLoading } = useLiveRouletteTableStats(table);
	return <Stat tableOrPlayerStat={tableStat} isLoading={isStatLoading} />;
};
