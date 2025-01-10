import { ETHSCAN } from '@/src/global';
import { useGetSelectedRound, useGetTableRoundPlayers } from '@/src/lib/live-roulette/query';
import type { PlayerRoundBets } from '@/src/lib/live-roulette/types';
import { useGetTableAddress } from '@/src/lib/shared/query';
import { truncateEthAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { Fox } from '@betfinio/ui';
import { useCustomUsername, useUsername } from 'betfinio_context/lib/query';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const PlayersTab = () => {
	const { tableAddress } = useGetTableAddress();
	const { round } = useGetSelectedRound();
	const { data: players = [] } = useGetTableRoundPlayers(tableAddress, round);

	return (
		<div className="flex flex-col gap-2">
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

	const { data: username } = useUsername(playerRoundBets.player);
	const { data: customUsername } = useCustomUsername(address, playerRoundBets.player);
	return (
		<motion.div
			key={playerRoundBets.created}
			layout
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			exit={{ opacity: 0, y: 10 }}
			className={cn('rounded-lg flex bg-background justify-between')}
		>
			<div className={'py-3 px-2 flex justify-between items-center grow gap-2'}>
				<div className={'flex items-start gap-2.5'}>
					<Fox className={'w-5 h-5'} />
					<div className={'flex flex-col text-tertiary-foreground text-xs gap-2'}>
						<a
							href={`${ETHSCAN}/address/${playerRoundBets.player}`}
							target={'_blank'}
							className={cn(
								'font-semibold text-sm text-tertiary-foreground hover:underline',
								playerRoundBets.player.toLowerCase() === address?.toLowerCase() && '!text-secondary-foreground',
							)}
							rel="noreferrer"
						>
							{customUsername || username || truncateEthAddress(playerRoundBets.player)}
						</a>
						<span
							className={cn({
								'opacity-0': playerRoundBets.betCounts === 0,
								'opacity-100': playerRoundBets.betCounts > 0,
							})}
						>
							{t('betCount', { count: playerRoundBets.betCounts })}
						</span>
					</div>
				</div>
				<div className={'flex flex-col items-end text-xs gap-2'}>
					<span>
						<BetValue precision={2} value={playerRoundBets.amount} withIcon />
					</span>
				</div>
			</div>
		</motion.div>
	);
};
