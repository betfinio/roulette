import { getColor } from '@/src/lib/roulette';
import type { PlayerBets, RouletteBet } from '@/src/lib/roulette/types';
import { valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetLogo } from '@betfinio/ui/dist/icons';
import { useTranslation } from 'react-i18next';

interface IRouletteResultToastProp {
	rouletteBet: PlayerBets;
}
export const RouletteResultToast: React.FC<IRouletteResultToastProp> = ({ rouletteBet }) => {
	const { t } = useTranslation('roulette');
	const winNumber = rouletteBet.winNumber;

	return (
		<div className={'roulette flex flex-col w-full'}>
			<div className={'flex flex-col w-full items-center border-b border-border p-2'}>
				<span className={'text-sm'}>{t('winning')}</span>
				<div className={'flex flex-row gap-2 justify-center text-lg items-center font-semibold'}>
					<BetLogo className={'w-4 h-4'} />
					<span className={cn(rouletteBet.winAmount > 0n ? 'text-green-roulette' : 'text-red-roulette')}>{valueToNumber(rouletteBet.winAmount)}</span> BET
				</div>
			</div>
			<div className={'w-full flex flex-row items-center'}>
				<div className={'w-1/2 flex flex-col items-center font-semibold p-2 gap-2 border-r border-border'}>
					<span className={'text-sm'}>{t('bet')}</span>
					<div className={'flex flex-row gap-2 justify-center text-lg items-center font-semibold'}>
						<span className={''}>{valueToNumber(rouletteBet.amount)}</span> BET
					</div>
				</div>
				<div className={'w-1/2 flex flex-col items-center font-semibold p-2 gap-2'}>
					<span className={'text-sm'}>{t('winNumber')}</span>
					<span
						className={cn(' w-8 h-8 rounded-xl flex justify-center whitespace-nowrap font-semibold items-center p-3', {
							'bg-red-roulette': getColor(winNumber) === 'RED',
							'bg-black-roulette': getColor(winNumber) === 'BLACK',
							'bg-green-roulette': getColor(winNumber) === 'GREEN',
						})}
					>
						{winNumber}
					</span>
				</div>
			</div>
		</div>
	);
};
