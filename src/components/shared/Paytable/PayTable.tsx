import { valueToNumber } from '@betfinio/abi';
import { BetValue } from '@betfinio/components/shared';
import { Link, X } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { useLimits } from '@/src/lib/shared/query';

interface IPaytableProps {
	onClose: () => void;
	table?: Address;
}
const Paytable: FC<IPaytableProps> = ({ onClose, table }) => {
	const { data: limits = [] } = useLimits(table);
	const { t } = useTranslation('roulette');
	return (
		<div className={'rl:bg-card games rl:rounded-lg rl:p-4 rl:w-full rl:text-foreground rl:relative'}>
			<X
				onClick={onClose}
				className={
					'rl:absolute rl:top-4 rl:right-4 rl:rounded-full  rl:text-foreground rl:border rl:border-foreground rl:w-6 rl:h-6 rl:p-1 rl:cursor-pointer rl:hover:border-red-roulette rl:hover:text-red-roulette rl:duration-300'
				}
			/>
			<h2 className={'rl:text-primary rl:font-semibold rl:text-lg'}>{t('payTable.paytable')}</h2>
			<div className={'rl:w-full rl:grid rl:grid-cols-4 rl:gap-1 rl:my-4'}>
				<span className={'rl:font-semibold rl:text-lg'}>{t('payTable.betType')}</span>
				<span className={'rl:font-semibold rl:text-lg'}>{t('payTable.payout')}</span>
				<span className={'rl:font-semibold rl:text-lg'}>{t('payTable.minBet')}</span>
				<span className={'rl:font-semibold rl:text-lg'}>{t('payTable.maxBet')}</span>

				{limits.map((limit, i) => (
					<div className={'rl:col-span-4  rl:grid rl:grid-cols-4'} key={i}>
						<span className={'rl:text-foreground/50'}>{limit.title}</span>
						<span className={'rl:text-primary'}>{limit.payout}x</span>
						<div className={'rl:text-success rl:flex rl:flex-row rl:gap-1 rl:items-center'}>
							<BetValue value={valueToNumber(limit.min)} withIcon />
						</div>
						<div className={'rl:text-red-roulette rl:flex rl:flex-row rl:gap-1 rl:items-center'}>
							<BetValue value={valueToNumber(limit.max)} withIcon />
						</div>
					</div>
				))}
			</div>
			<div className={'rl:mt-5 rl:text-sm rl:flex rl:justify-end'}>
				<a
					className={'rl:flex rl:gap-1 rl:underline rl:hover:text-primary rl:duration-300'}
					href="https://betfin.gitbook.io/betfin-public/games-manual/games-guide/roulette/roulette-t-and-c"
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
