import { ETHSCAN } from '@/src/global.ts';
import { getColor } from '@/src/lib/roulette';
import type { RouletteBet } from '@/src/lib/roulette/types.ts';
import { ZeroAddress, truncateEthAddress, valueToNumber } from '@betfinio/abi';
import { Link } from '@tanstack/react-router';
import { BetValue } from 'betfinio_app/BetValue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'betfinio_app/tabs';
import cx from 'clsx';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, X } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { AllBetsTable } from './AllBetsTable';
import { MyBetsTable } from './MyBets';

const History = () => {
	return (
		<Tabs defaultValue={'my'}>
			<TabsList>
				<TabsTrigger value={'my'}>My Bets</TabsTrigger>
				<TabsTrigger value={'all'}>All Bets</TabsTrigger>
			</TabsList>

			<TabsContent value={'my'}>
				<MyBetsTable />
			</TabsContent>
			<TabsContent value={'all'}>
				<AllBetsTable />
			</TabsContent>
		</Tabs>
	);
};

export default History;

export const RoundModal: FC<{
	selectedBet: RouletteBet | null;
	onClose: () => void;
}> = ({ selectedBet, onClose }) => {
	return (
		<motion.div
			onClick={(e) => e.stopPropagation()}
			className={
				'roulette relative mx-auto text-foreground   text-base font-semibold bg-card w-full min-w-[90vw] sm:min-w-[500px] max-w-[600px] min-h-[300px] rounded-lg p-4 xs:px-1 sm:p-8'
			}
		>
			<div className={'flex items-center justify-between px-4 sm:px-0'}>
				<p>Betting ticket</p>
				<X
					onClick={onClose}
					className={'w-4 h-4 border border-current rounded-full cursor-pointer hover:text-red-roulette hover:border-red-roulette duration-200'}
				/>
			</div>

			<div className={'mt-8'}>
				<p className={'text-center'}>Winning</p>
				<div className={'flex items-center justify-center gap-3'}>
					<div className={cx('font-semibold text-4xl text-tertiary-foreground flex gap-2', (selectedBet?.result ?? 0n) > 0n && '!text-green-roulette')}>
						{valueToNumber(selectedBet?.result) > 0 && '+'}
						<BetValue withIcon className={'gap-2'} value={valueToNumber(selectedBet?.result)} iconClassName={'w-6 h-6'} />
					</div>
				</div>
			</div>

			<div className={'mt-6 py-6 border-y border-border border-opacity-10'}>
				<div className={'grid grid-cols-2 relative'}>
					<div>
						<div className={'text-center text-tertiary-foreground text-sm'}>Total bet</div>
						<div className={'flex mt-2 gap-1 items-center justify-center'}>
							<div className={'text-base'}>
								<BetValue value={valueToNumber(selectedBet?.amount)} withIcon={true} />
							</div>
						</div>
					</div>

					<div className={'w-[1px] absolute left-[50%] -translate-x-[50%] h-full bg-border bg-opacity-10'} />

					<div>
						<p className={'text-center text-tertiary-foreground text-sm'}>Win number</p>
						<div className={'flex mt-1 gap-1 items-center justify-center'}>
							<div
								className={cx(' min-w-[30px] min-h-[30px] rounded-lg flex justify-center font-semibold items-center text-xs', {
									'bg-red-roulette': getColor(selectedBet?.winNumber ?? 0) === 'RED',
									'bg-black-roulette': getColor(selectedBet?.winNumber ?? 0) === 'BLACK',
									'bg-green-roulette': getColor(selectedBet?.winNumber ?? 0) === 'GREEN',
								})}
							>
								{selectedBet?.winNumber === 42 ? <div className={'px-2'}>Waiting</div> : selectedBet?.winNumber}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={'mt-5 flex flex-col items-center'}>
				<div className={'text-center'}>Bet ID:</div>
				<Link
					to={`${ETHSCAN}/address/${selectedBet?.address}`}
					className={'block text-center underline cursor-pointer hover:text-accent-secondary-foreground duration-300 px-4 sm:hidden'}
					target={'_blank'}
				>
					{truncateEthAddress(selectedBet?.address || ZeroAddress, 7)}
				</Link>
				<Link
					to={`${ETHSCAN}/address/${selectedBet?.address}`}
					className={'text-center underline cursor-pointer hover:text-accent-secondary-foreground duration-300 px-4 hidden sm:inline-block'}
					target={'_blank'}
				>
					{selectedBet?.address}
				</Link>
				<p className={'text-center font-normal text-tertiary-foreground'}>
					{DateTime.fromMillis(Number(selectedBet?.created) * 1000).toFormat('yyyy-MM-dd, HH:mm:ss Z')} UTC
				</p>
			</div>

			<div className={'flex items-end justify-center gap-2 mt-5'}>
				<p className={'text-tertiary-foreground font-semibold'}>Proof of random:</p>
				<ShieldCheckIcon className={'text-green-roulette w-5 h-5'} />
				<a
					href={`${ETHSCAN}/tx/${selectedBet?.hash}`}
					target={'_blank'}
					className={cx('block text-center underline cursor-pointer hover:text-accent-secondary-foreground duration-300')}
					rel="noreferrer"
				>
					{truncateEthAddress(selectedBet?.hash || ZeroAddress)}
				</a>
			</div>
			<div className={'text-xs mt-1 text-center '}>
				<a
					className={'text-tertiary-foreground hover:text-green-roulette duration-300 underline'}
					href="https://betfin.gitbook.io/betfin-public/proof-of-fairness/random-number-generation"
					target={'_blank'}
					rel="noreferrer"
				>
					How it works?
				</a>
			</div>
		</motion.div>
	);
};