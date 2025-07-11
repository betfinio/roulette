import { truncateEthAddress, valueToNumber, ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue } from '@betfinio/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { ShieldCheckIcon, X } from 'lucide-react';
import { DateTime } from 'luxon';
import { motion } from 'motion/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { ETHSCAN } from '@/src/global.ts';
import { getColor } from '@/src/lib/roulette';
import { useGetTransactionHashByBet } from '@/src/lib/roulette/query';
import { useVisibleTable } from '@/src/lib/shared/query';
import { AllBetsTable as MultiplePlayerAllBetsTable } from '../live-roulette/History/AllBetsTable';
import { MyBetsTable as MultiplePlayerMyBetsTable } from '../live-roulette/History/MyBets';
import { AllBetsTable as SinglePlayerAllBetsTable } from '../roulette/History/AllBetsTable';
import { MyBetsTable as SinglePlayerMyBetsTable } from '../roulette/History/MyBets';

const History = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });

	const { isSingle } = useVisibleTable();
	return (
		<Tabs defaultValue={'my'}>
			<TabsList>
				<TabsTrigger value={'my'}>{t('myBets')}</TabsTrigger>
				<TabsTrigger value={'all'}>{t('allBets')}</TabsTrigger>
			</TabsList>

			<TabsContent value={'my'}>{isSingle ? <SinglePlayerMyBetsTable /> : <MultiplePlayerMyBetsTable />}</TabsContent>
			<TabsContent value={'all'}>{isSingle ? <SinglePlayerAllBetsTable /> : <MultiplePlayerAllBetsTable />}</TabsContent>
		</Tabs>
	);
};

export default History;

interface IRoundModalProps {
	selectedBet: {
		bet: Address;
		winAmount: bigint;
		winNumber: number;
		created: bigint;
		amount: bigint;
	} | null;
	onClose: () => void;
}
export const RoundModal: FC<IRoundModalProps> = ({ selectedBet, onClose }) => {
	const { data: transactionHash, isLoading } = useGetTransactionHashByBet(selectedBet?.bet || ZeroAddress);

	const { isMobile } = useMediaQuery();
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	return (
		<motion.div
			onClick={(e) => e.stopPropagation()}
			className={
				' rl:relative rl:mx-auto rl:text-foreground   rl:text-base rl:font-semibold rl:bg-card rl:w-full rl:min-w-[90vw] rl:sm:min-w-[500px] rl:max-w-[600px] rl:min-h-[300px] rl:rounded-lg rl:p-4 rl:xs:px-1 rl:sm:p-8'
			}
		>
			<div className={'rl:flex rl:items-center rl:justify-between rl:px-4 rl:sm:px-0'}>
				<div>{t('bettingTicket')}</div>
				<X
					onClick={onClose}
					className={
						'rl:w-4 rl:h-4 rl:border rl:border-current rl:rounded-full rl:cursor-pointer rl:hover:text-red-roulette rl:hover:border-red-roulette rl:duration-200'
					}
				/>
			</div>

			<div className={'rl:mt-8'}>
				<div className={'rl:text-center'}>{t('winning')}</div>
				<div className={'rl:flex rl:items-center rl:justify-center rl:gap-3'}>
					<div
						className={cn('rl:font-semibold rl:text-4xl rl:text-tertiary-foreground rl:flex rl:gap-2', {
							'rl:text-green-roulette!': valueToNumber(selectedBet?.winAmount) > 0,
						})}
					>
						{valueToNumber(selectedBet?.winAmount ?? 0n) > 0 && '+'}
						<BetValue withIcon className={'rl:gap-2'} value={valueToNumber(selectedBet?.winAmount)} iconClassName={'rl:w-6 rl:h-6'} />
					</div>
				</div>
			</div>

			<div className={'rl:mt-6 rl:py-6 rl:border-y rl:border-border rl:border-opacity-10'}>
				<div className={'rl:grid rl:grid-cols-2 rl:relative'}>
					<div>
						<div className={'rl:text-center rl:text-tertiary-foreground rl:text-sm'}>{t('totalBet')}</div>
						<div className={'rl:flex rl:mt-2 rl:gap-1 rl:items-center rl:justify-center'}>
							<div className={'rl:text-base'}>
								<BetValue value={valueToNumber(selectedBet?.amount)} withIcon={true} />
							</div>
						</div>
					</div>

					<div className={'rl:w-[1px] rl:absolute rl:left-[50%] rl:-translate-x-[50%] rl:h-full rl:bg-border rl:bg-opacity-10'} />

					<div>
						<div className={'rl:text-center rl:text-tertiary-foreground rl:text-sm'}>{t('winNumber')}</div>
						<div className={'rl:flex rl:mt-1 rl:gap-1 rl:items-center rl:justify-center'}>
							<div
								className={cn(' rl:min-w-[30px] rl:min-h-[30px] rl:rounded-lg rl:flex rl:justify-center rl:font-semibold rl:items-center rl:text-xs', {
									'rl:bg-red-roulette': getColor(selectedBet?.winNumber ?? 0) === 'RED',
									'rl:bg-black-roulette': getColor(selectedBet?.winNumber ?? 0) === 'BLACK',
									'rl:bg-green-roulette': getColor(selectedBet?.winNumber ?? 0) === 'GREEN',
								})}
							>
								{selectedBet?.winNumber === 42 ? <div className={'rl:px-2'}>{t('waiting')}</div> : selectedBet?.winNumber}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={'rl:mt-5 rl:flex rl:flex-col rl:items-center'}>
				<div className={'rl:text-center'}>{t('betID')}</div>
				<a
					href={`${ETHSCAN}/address/${selectedBet?.bet}`}
					className={'rl:block rl:text-center rl:underline rl:cursor-pointer rl:hover:text-primary rl:duration-300 rl:px-4 '}
					target={'_blank'}
					rel="noreferrer"
				>
					{isMobile ? truncateEthAddress(selectedBet?.bet || ZeroAddress, 7) : selectedBet?.bet}
				</a>

				<div className={'rl:text-center rl:font-normal rl:text-tertiary-foreground'}>
					{DateTime.fromMillis(Number(selectedBet?.created) * 1000).toFormat('yyyy-MM-dd, HH:mm:ss Z')} UTC
				</div>
			</div>

			<div className={cn('rl:flex rl:items-end rl:justify-center rl:gap-2 rl:mt-5', { hidden: transactionHash === undefined })}>
				<div className={'rl:text-tertiary-foreground rl:font-semibold'}>{t('proofOfRandom')}</div>
				<ShieldCheckIcon className={'rl:text-green-roulette rl:w-5 rl:h-5'} />
				<a
					href={`${ETHSCAN}/tx/${transactionHash}`}
					target={'_blank'}
					className={cn('rl:block rl:text-center rl:underline rl:cursor-pointer rl:hover:text-primary rl:duration-300', {
						blur: isLoading,
					})}
					rel="noreferrer"
				>
					{truncateEthAddress(transactionHash || ZeroAddress)}
				</a>
			</div>
			<div className={'rl:text-xs rl:mt-1 rl:text-center '}>
				<a
					className={'rl:text-tertiary-foreground rl:hover:text-green-roulette rl:duration-300 rl:underline'}
					href="https://betfin.gitbook.io/betfin-public/proof-of-fairness/random-number-generation"
					target={'_blank'}
					rel="noreferrer"
				>
					{t('howItWorks')}
				</a>
			</div>
		</motion.div>
	);
};
