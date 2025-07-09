import { valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetLogo } from '@betfinio/components/icons';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/src/lib/roulette';

interface IRouletteResultToastProp {
	rouletteBet: {
		amount: bigint;
		winAmount: bigint;
		winNumber: number;
	};
}
export const RouletteResultToast: React.FC<IRouletteResultToastProp> = ({ rouletteBet }) => {
	const { t } = useTranslation('roulette');
	const winNumber = rouletteBet.winNumber;

	return (
		<div className={' rl:flex rl:flex-col rl:w-full'}>
			<div className={'rl:flex rl:flex-col rl:w-full rl:items-center rl:border-b rl:border-border rl:p-2'}>
				<span className={'rl:text-sm'}>{t('winning')}</span>
				<div className={'rl:flex rl:flex-row rl:gap-2 rl:justify-center rl:text-lg rl:items-center rl:font-semibold'}>
					<BetLogo className={'rl:w-4 rl:h-4'} />
					<span className={cn(rouletteBet.winAmount > 0n ? 'rl:text-green-roulette' : 'rl:text-red-roulette')}>{valueToNumber(rouletteBet.winAmount)}</span> BET
				</div>
			</div>
			<div className={'rl:w-full rl:flex rl:flex-row rl:items-center'}>
				<div className={'rl:w-1/2 rl:flex rl:flex-col rl:items-center rl:font-semibold rl:p-2 rl:gap-2 rl:border-r rl:border-border'}>
					<span className={'rl:text-sm'}>{t('bet')}</span>
					<div className={'rl:flex rl:flex-row rl:gap-2 rl:justify-center rl:text-lg rl:items-center rl:font-semibold'}>
						<span className={''}>{valueToNumber(rouletteBet.amount)}</span> BET
					</div>
				</div>
				<div className={'rl:w-1/2 rl:flex rl:flex-col rl:items-center rl:font-semibold rl:p-2 rl:gap-2'}>
					<span className={'rl:text-sm'}>{t('winNumber')}</span>
					<span
						className={cn('	rl:w-8 rl:h-8 rl:rounded-xl rl:flex rl:justify-center rl:whitespace-nowrap rl:font-semibold rl:items-center rl:p-3', {
							'rl:bg-red-roulette': getColor(winNumber) === 'RED',
							'rl:bg-black-roulette': getColor(winNumber) === 'BLACK',
							'rl:bg-green-roulette': getColor(winNumber) === 'GREEN',
						})}
					>
						{winNumber}
					</span>
				</div>
			</div>
		</div>
	);
};
