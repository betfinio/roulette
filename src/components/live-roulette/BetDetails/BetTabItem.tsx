import { ETHSCAN } from '@/src/global';
import type { PlayerInProgressBet } from '@/src/lib/live-roulette/types';
import { truncateEthAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { useUsername } from 'betfinio_context/lib/query';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useAccount } from 'wagmi';

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
			className={cn('rounded-lg flex justify-between', {
				'bg-background': !isWinnerCard,
				'bg-linear-to-r from-primary/50 via-primaryLight to-transparent border-primary border': index === 0 && isWinnerCard,
				'bg-linear-to-r from-tertiary-foreground/20 via-primaryLight to-transparent border-tertiary-foreground border': index === 1 && isWinnerCard,
				'bg-linear-to-r from-orange-600/50 via-primaryLight to-transparent border-orange-600 border ': index === 2 && isWinnerCard,
			})}
		>
			<div className={'py-3 px-2 flex justify-between items-center grow gap-2'}>
				<div className={'flex items-start gap-2.5'}>
					<div className={'flex flex-col text-xs gap-2'}>
						<a
							href={`${ETHSCAN}/address/${bet.player}`}
							target={'_blank'}
							className={cn(
								'font-semibold text-sm text-tertiary-foreground hover:underline',

								{
									'text-primary!': bet.player.toLowerCase() === address?.toLowerCase(),
									'text-tertiary-foreground ': !isWinnerCard,
									'text-foreground ': isWinnerCard,
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
								'text-tertiary-foreground ': !isWinnerCard,
								'text-foreground ': isWinnerCard,
							})}
						>
							{truncateEthAddress(bet.bet)}
						</a>
					</div>
				</div>
				<div className={'flex flex-col items-end text-xs gap-2'}>
					<span>
						<BetValue precision={2} value={bet.amount} withIcon />
					</span>
					{showWinnders && (
						<span>
							<BetValue
								className={cn({
									'text-success font-medium': hasWon,
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
