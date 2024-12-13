import { ETHSCAN } from '@/src/global.ts';
import { getColor } from '@/src/lib/roulette';
import { useGetTableAddress } from '@/src/lib/roulette/query';
import type { PlayerBets } from '@/src/lib/roulette/types.ts';
import { ZeroAddress, truncateEthAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, X } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AllBetsTable as MultiplePlayerAllBetsTable } from '../live-roulette/History/AllBetsTable';
import { MyBetsTable as MultiplePlayerMyBetsTable } from '../live-roulette/History/MyBets';
import { AllBetsTable as SinglePlayerAllBetsTable } from '../roulette/History/AllBetsTable';
import { MyBetsTable as SinglePlayerMyBetsTable } from '../roulette/History/MyBets';

const History = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });

	const { isSingle } = useGetTableAddress();
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

export const RoundModal: FC<{
	selectedBet: PlayerBets | null;
	onClose: () => void;
}> = ({ selectedBet, onClose }) => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	return (
		<motion.div
			onClick={(e) => e.stopPropagation()}
			className={
				'roulette relative mx-auto text-foreground   text-base font-semibold bg-card w-full min-w-[90vw] sm:min-w-[500px] max-w-[600px] min-h-[300px] rounded-lg p-4 xs:px-1 sm:p-8'
			}
		>
			<div className={'flex items-center justify-between px-4 sm:px-0'}>
				<p>{t('bettingTicket')}</p>
				<X
					onClick={onClose}
					className={'w-4 h-4 border border-current rounded-full cursor-pointer hover:text-red-roulette hover:border-red-roulette duration-200'}
				/>
			</div>

			<div className={'mt-8'}>
				<p className={'text-center'}>{t('winning')}</p>
				<div className={'flex items-center justify-center gap-3'}>
					<div
						className={cn('font-semibold text-4xl text-tertiary-foreground flex gap-2', {
							'!text-green-roulette': valueToNumber(selectedBet?.winAmount) > 0,
						})}
					>
						{valueToNumber(selectedBet?.winAmount ?? 0n) > 0 && '+'}
						<BetValue withIcon className={'gap-2'} value={valueToNumber(selectedBet?.winAmount)} iconClassName={'w-6 h-6'} />
					</div>
				</div>
			</div>

			<div className={'mt-6 py-6 border-y border-border border-opacity-10'}>
				<div className={'grid grid-cols-2 relative'}>
					<div>
						<div className={'text-center text-tertiary-foreground text-sm'}>{t('totalBet')}</div>
						<div className={'flex mt-2 gap-1 items-center justify-center'}>
							<div className={'text-base'}>
								<BetValue value={valueToNumber(selectedBet?.amount)} withIcon={true} />
							</div>
						</div>
					</div>

					<div className={'w-[1px] absolute left-[50%] -translate-x-[50%] h-full bg-border bg-opacity-10'} />

					<div>
						<p className={'text-center text-tertiary-foreground text-sm'}>{t('winNumber')}</p>
						<div className={'flex mt-1 gap-1 items-center justify-center'}>
							<div
								className={cn(' min-w-[30px] min-h-[30px] rounded-lg flex justify-center font-semibold items-center text-xs', {
									'bg-red-roulette': getColor(selectedBet?.winNumber ?? 0) === 'RED',
									'bg-black-roulette': getColor(selectedBet?.winNumber ?? 0) === 'BLACK',
									'bg-green-roulette': getColor(selectedBet?.winNumber ?? 0) === 'GREEN',
								})}
							>
								{selectedBet?.winNumber === 42 ? <div className={'px-2'}>{t('waiting')}</div> : selectedBet?.winNumber}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={'mt-5 flex flex-col items-center'}>
				<div className={'text-center'}>{t('betID')}</div>
				<Link
					to={`${ETHSCAN}/address/${selectedBet?.bet}`}
					className={'block text-center underline cursor-pointer hover:text-secondary-foreground duration-300 px-4 sm:hidden'}
					target={'_blank'}
				>
					{truncateEthAddress(selectedBet?.transactionHash || ZeroAddress, 7)}
				</Link>
				<Link
					to={`${ETHSCAN}/address/${selectedBet?.bet}`}
					className={'text-center underline cursor-pointer hover:text-secondary-foreground duration-300 px-4 hidden sm:inline-block'}
					target={'_blank'}
				>
					{selectedBet?.bet}
				</Link>
				<p className={'text-center font-normal text-tertiary-foreground'}>
					{DateTime.fromMillis(Number(selectedBet?.created) * 1000).toFormat('yyyy-MM-dd, HH:mm:ss Z')} UTC
				</p>
			</div>

			<div className={'flex items-end justify-center gap-2 mt-5'}>
				<p className={'text-tertiary-foreground font-semibold'}>{t('proofOfRandom')}</p>
				<ShieldCheckIcon className={'text-green-roulette w-5 h-5'} />
				<a
					href={`${ETHSCAN}/tx/${selectedBet?.transactionHash}`}
					target={'_blank'}
					className={cn('block text-center underline cursor-pointer hover:text-secondary-foreground duration-300')}
					rel="noreferrer"
				>
					{truncateEthAddress(selectedBet?.transactionHash || ZeroAddress)}
				</a>
			</div>
			<div className={'text-xs mt-1 text-center '}>
				<a
					className={'text-tertiary-foreground hover:text-green-roulette duration-300 underline'}
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
