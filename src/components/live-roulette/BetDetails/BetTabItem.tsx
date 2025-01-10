import { ETHSCAN } from '@/src/global';
import { fillItems } from '@/src/lib/live-roulette';
import type { PlayerInProgressBet } from '@/src/lib/live-roulette/types';
import { useGetBetAmountAndBitMap, useRouletteOthersBetsState } from '@/src/lib/shared/query';
import { truncateEthAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue } from '@betfinio/components/shared';
import { useCustomUsername, useUsername } from 'betfinio_app/lib/query/username';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { dozenItemsConfig, sideItemsConfig } from '../../shared/MainTable/SideTable';
import { tableConfigHorizontal } from '../../shared/MainTable/tableConfigHorizontal';
import { tableConfigVertical } from '../../shared/MainTable/tableConfigVertical';
import { tableExtraConfigHorizontal, tableExtraConfigVertical } from '../../shared/MainTable/tableExtraItemsConfig';

interface IBetTabItemProps {
	bet: PlayerInProgressBet;
	round: number;
	showWinnders: boolean;
	index: number;
}
export const BetItem: FC<IBetTabItemProps> = ({ bet, showWinnders, index }) => {
	const { address } = useAccount();

	const { data: username } = useUsername(bet.player);
	const { data: customUsername } = useCustomUsername(address, bet.player);

	const { mutateAsync } = useGetBetAmountAndBitMap(bet.bet);
	const { isVertical } = useMediaQuery();
	const { updateState } = useRouletteOthersBetsState();

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
				'bg-gradient-to-r from-primary/50 via-primaryLight to-transparent border-primary border': index === 0 && isWinnerCard,
				'bg-gradient-to-r from-tertiary-foreground/20 via-primaryLight to-transparent border-tertiary-foreground border': index === 1 && isWinnerCard,
				'bg-gradient-to-r from-orange-600/50 via-primaryLight to-transparent border-orange-600 border ': index === 2 && isWinnerCard,
			})}
			onMouseEnter={() => {
				// mutateAsync(null, {
				// 	onSuccess: (data) => {
				// 		const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;
				// 		const extraItems = isVertical ? tableExtraConfigVertical : tableExtraConfigHorizontal;
				// 		const test = fillItems(data, { ...dozenItemsConfig, ...sideItemsConfig, ...tableConfig, ...extraItems });
				// 		//updateState({ selectedBetChips: test });
				// 	},
				// });
			}}
			onMouseLeave={() => updateState({ selectedBetChips: null })}
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
									'!text-secondary-foreground': bet.player.toLowerCase() === address?.toLowerCase(),
									'text-tertiary-foreground ': !isWinnerCard,
									'text-foreground ': isWinnerCard,
								},
							)}
							rel="noreferrer"
						>
							{customUsername || username || truncateEthAddress(bet.player)}
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
