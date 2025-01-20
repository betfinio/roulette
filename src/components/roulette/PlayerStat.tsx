import { useGetRouletteTableStats } from '@/src/lib/roulette/query';
import { Stat } from '../shared/Stat/Stat';

export const PlayerStat = () => {
	const { data: playerStat, isLoading: isPlayerStatLoading } = useGetRouletteTableStats();

	return <Stat tableOrPlayerStat={playerStat} isLoading={isPlayerStatLoading} />;
};
