import { truncateEthAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { useUsername } from 'betfinio_context/lib/query';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { ETHSCAN } from '@/src/global';
import type { PlayerInProgressBet } from '@/src/lib/live-roulette/types';

interface IBetTabItemProps {
	bet: PlayerInProgressBet;
	round: number;
	showWinnders: boolean;
	index: number;
}
export const BetItem: FC<IBetTabItemProps> = ({ bet, showWinnders, index }) => {
	const { address } = useAccount();

	const { data: username } = useUsername(bet.player, address);

	const hasWon = bet.winAmount && bet.winAmount > 0n;
	const isWinnerCard = showWinnders && hasWon && index < 3;
	return (
		<motion.div
			key={bet.bet}
			layout
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			exit={{ opacity: 0, y: 10 }}
			className={cn('rl:rounded-lg rl:flex rl:justify-between', {
				'rl:bg-background': !isWinnerCard,
				'rl:bg-linear-to-r rl:from-primary/50 rl:via-primaryLight rl:to-transparent rl:border-primary rl:border': index === 0 && isWinnerCard,
				'rl:bg-linear-to-r rl:from-tertiary-foreground/20 rl:via-primaryLight rl:to-transparent rl:border-tertiary-foreground rl:border':
					index === 1 && isWinnerCard,
				'rl:bg-linear-to-r rl:from-orange-600/50 rl:via-primaryLight rl:to-transparent rl:border-orange-600 rl:border ': index === 2 && isWinnerCard,
			})}
		>
			<div className={'rl:py-3 rl:px-2 rl:flex rl:justify-between rl:items-center rl:grow rl:gap-2'}>
				<div className={'rl:flex rl:items-start gap-2.5'}>
					<div className={'rl:flex rl:flex-col rl:text-xs gap-2'}>
						<a
							href={`${ETHSCAN}/address/${bet.player}`}
							target={'_blank'}
							className={cn(
								'rl:font-semibold rl:text-sm rl:text-tertiary-foreground rl:hover:underline',

								{
									'rl:text-primary!': bet.player.toLowerCase() === address?.toLowerCase(),
									'rl:text-tertiary-foreground ': !isWinnerCard,
									'rl:text-foreground ': isWinnerCard,
								},
							)}
							rel="noreferrer"
						>
							{username}
						</a>
						<a
							href={`${ETHSCAN}/address/${bet.bet}`}
							target={'_blank'}
							rel={'noreferrer'}
							className={cn({
								'rl:text-tertiary-foreground ': !isWinnerCard,
								'rl:text-foreground ': isWinnerCard,
							})}
						>
							{truncateEthAddress(bet.bet)}
						</a>
					</div>
				</div>
				<div className={'rl:flex rl:flex-col rl:items-end rl:text-xs rl:gap-2'}>
					<span>
						<BetValue precision={2} value={bet.amount} withIcon />
					</span>
					{showWinnders && (
						<span>
							<BetValue
								className={cn({
									'rl:text-success rl:font-medium': hasWon,
								})}
								precision={2}
								value={bet.winAmount ?? 0n}
								withIcon
							/>
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
};
