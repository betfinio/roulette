import { cn } from '@betfinio/components';
import { Fox } from '@betfinio/components/icons';
import { BetValue } from '@betfinio/components/shared';
import { useUsername } from 'betfinio_context/lib/query';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { ETHSCAN } from '@/src/global';
import { useGetSelectedRound, useGetTableRoundPlayers } from '@/src/lib/live-roulette/query';
import type { PlayerRoundBets } from '@/src/lib/live-roulette/types';
import { useVisibleTable } from '@/src/lib/shared/query';

export const PlayersTab = () => {
	const { table } = useVisibleTable();
	const { round } = useGetSelectedRound();
	const { data: players = [] } = useGetTableRoundPlayers(table, round);

	return (
		<div className="rl:flex rl:flex-col rl:gap-2">
			{players.map((playerRoundBets) => {
				return <PlayersTabItem key={playerRoundBets.created} playerRoundBets={playerRoundBets} />;
			})}
		</div>
	);
};

interface IPlayersTabItemProps {
	playerRoundBets: PlayerRoundBets;
}
export const PlayersTabItem: FC<IPlayersTabItemProps> = ({ playerRoundBets }) => {
	const { t } = useTranslation('roulette');
	const { address } = useAccount();

	const { data: username } = useUsername(playerRoundBets.player, address);
	return (
		<motion.div
			key={playerRoundBets.created}
			layout
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			exit={{ opacity: 0, y: 10 }}
			className={cn('rl:rounded-lg rl:flex rl:bg-background rl:justify-between')}
		>
			<div className={'rl:py-3 rl:px-2 rl:flex rl:justify-between rl:items-center rl:grow rl:gap-2'}>
				<div className={'rl:flex rl:items-start rl:gap-2.5'}>
					<Fox className={'rl:w-5 rl:h-5'} />
					<div className={'rl:flex rl:flex-col rl:text-tertiary-foreground rl:text-xs rl:gap-2'}>
						<a
							href={`${ETHSCAN}/address/${playerRoundBets.player}`}
							target={'_blank'}
							className={cn(
								'rl:font-semibold rl:text-sm rl:text-tertiary-foreground rl:hover:underline',
								playerRoundBets.player.toLowerCase() === address?.toLowerCase() && 'rl:text-primary!',
							)}
							rel="noreferrer"
						>
							{username}
						</a>
						<span
							className={cn({
								'rl:opacity-0': playerRoundBets.betCounts === 0,
								'rl:opacity-100': playerRoundBets.betCounts > 0,
							})}
						>
							{t('betCount', { count: playerRoundBets.betCounts })}
						</span>
					</div>
				</div>
				<div className={'rl:flex rl:flex-col rl:items-end rl:text-xs rl:gap-2'}>
					<span>
						<BetValue precision={2} value={playerRoundBets.amount} withIcon />
					</span>
				</div>
			</div>
		</motion.div>
	);
};
