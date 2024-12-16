import { ETHSCAN } from '@/src/global';
import { fillItems } from '@/src/lib/roulette';
import { useGetBetAmountAndBitMap, useRouletteOtherBetsState } from '@/src/lib/roulette/query';
import type { RoundBet } from '@/src/lib/roulette/types';
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
	bet: RoundBet;
	round: number;
}
export const BetItem: FC<IBetTabItemProps> = ({ bet, round }) => {
	const { address } = useAccount();

	const { data: username } = useUsername(bet.player);
	const { data: customUsername } = useCustomUsername(address, bet.player);

	const { mutateAsync } = useGetBetAmountAndBitMap(bet.bet);
	const { isVertical } = useMediaQuery();
	const { updateState } = useRouletteOtherBetsState();
	return (
		<motion.div
			key={bet.bet}
			layout
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			exit={{ opacity: 0, y: 10 }}
			className={cn('rounded-lg flex bg-background justify-between')}
			onMouseEnter={() => {
				mutateAsync(null, {
					onSuccess: (data) => {
						const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;
						const etraItems = isVertical ? tableExtraConfigVertical : tableExtraConfigHorizontal;
						const test = fillItems(data, { ...dozenItemsConfig, ...sideItemsConfig, ...tableConfig, ...etraItems });

						updateState({ selectedBetChips: test });
					},
				});
			}}
			onMouseLeave={() => updateState({ selectedBetChips: null })}
		>
			<div className={'py-3 px-2 flex justify-between items-center grow gap-2'}>
				<div className={'flex items-start gap-2.5'}>
					<div className={'flex flex-col text-tertiary-foreground text-xs gap-2'}>
						<a
							href={`${ETHSCAN}/address/${bet.player}`}
							target={'_blank'}
							className={cn(
								'font-semibold text-sm text-tertiary-foreground hover:underline',
								bet.player.toLowerCase() === address?.toLowerCase() && '!text-secondary-foreground',
							)}
							rel="noreferrer"
						>
							{customUsername || username || truncateEthAddress(bet.player)}
						</a>
						<a href={`${ETHSCAN}/address/${bet.bet}`} target={'_blank'} rel={'noreferrer'}>
							{truncateEthAddress(bet.bet)}
						</a>
					</div>
				</div>
				<div className={'flex flex-col items-end text-xs gap-2'}>
					<span>
						<BetValue precision={2} value={bet.amount} withIcon />
					</span>
				</div>
			</div>
		</motion.div>
	);
};
