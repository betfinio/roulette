import { useLimits } from '@/src/lib/roulette/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { BetValue } from '@betfinio/components/shared';
import { Link, X } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

interface IPaytableProps {
	onClose: () => void;
	tableAddress?: Address;
}
const Paytable: FC<IPaytableProps> = ({ onClose, tableAddress }) => {
	const { data: limits = [] } = useLimits(tableAddress);
	const { t } = useTranslation('roulette');
	return (
		<div className={'roulette bg-card games rounded-lg p-4 w-full text-foreground relative'}>
			<X
				onClick={onClose}
				className={
					'absolute top-4 right-4 rounded-full  text-foreground border border-foreground w-6 h-6 p-1 cursor-pointer hover:border-red-roulette hover:text-red-roulette duration-300'
				}
			/>
			<h2 className={'text-secondary-foreground font-semibold text-lg'}>{t('payTable.paytable')}</h2>
			<div className={'w-full grid grid-cols-4 gap-1 my-4'}>
				<span className={'font-semibold text-lg'}>{t('payTable.betType')}</span>
				<span className={'font-semibold text-lg'}>{t('payTable.payout')}</span>
				<span className={'font-semibold text-lg'}>{t('payTable.minBet')}</span>
				<span className={'font-semibold text-lg'}>{t('payTable.maxBet')}</span>

				{limits.map((limit, i) => (
					<div className={'col-span-4  grid grid-cols-4'} key={i}>
						<span className={'text-foreground/50'}>{limit.title}</span>
						<span className={'text-secondary-foreground'}>{limit.payout}x</span>
						<div className={'text-success flex flex-row gap-1 items-center'}>
							<BetValue value={valueToNumber(limit.min)} withIcon />
						</div>
						<div className={'text-red-roulette flex flex-row gap-1 items-center'}>
							<BetValue value={valueToNumber(limit.max)} withIcon />
						</div>
					</div>
				))}
			</div>
			<div className={'mt-5 text-sm flex justify-end'}>
				<a
					className={'flex gap-1 underline hover:text-secondary-foreground duration-300'}
					href="https://betfin.gitbook.io/betfin-public/games-guide/roulette-single-player/roulette-single-player-terms"
					target={'_blank'}
					rel="noreferrer"
				>
					{t('payTable.learnMore')}
					<Link width={12} />
				</a>
			</div>
		</div>
	);
};

export default Paytable;
