import { Button } from 'betfinio_app/button';
import { AlertCircle, CircleAlert, CircleHelp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useLocalBets, usePaytable, usePotentialWin } from '@/src/lib/roulette/query';
import { classNames } from '@/src/libs/classNames';
import { valueToNumber } from '@betfinio/abi';
import { Bag } from '@betfinio/ui/dist/icons';
import { BetValue } from 'betfinio_app/BetValue';
import { Dialog, DialogContent } from 'betfinio_app/dialog';
import { useBalance } from 'betfinio_app/lib/query/token';
import { Separator } from 'betfinio_app/separator';
import { useMemo } from 'react';
import Paytable from '../Paytable/PayTable';

export const BetStatusHeaderHorizontal = () => {
	const { t } = useTranslation('roulette');
	const { isOpen: isPaytableOpen, openPaytable, closePaytable } = usePaytable();
	const handleReport = () => {
		document.getElementById('live-chat-ai-button')?.click();
	};

	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);
	const { data: bets = [] } = useLocalBets();
	const { data: potentialWin = 1928234n * 10n ** 18n, isLoading } = usePotentialWin();

	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);

	const maxPayout = useMemo(() => {
		return winningPool / 20n;
	}, [winningPool]);
	return (
		<div className=" rounded-lg bg-card items-center border border-border p-3 px-4 flex justify-between min-h-16 gap-2 md:gap-4 ">
			<div className="flex gap-2 md:gap-9">
				<div className="flex gap-1 items-center">
					<Bag className={'w-8 text-accent-secondary-foreground'} />
					<div>
						<p>{t('winningPool')}</p>
						<p className="font-bold">
							<BetValue withIcon value={winningPool} />
						</p>
					</div>
				</div>
				<div>
					<p>{t('maxPayout')}</p>
					<p className="font-bold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</p>
				</div>
			</div>
			<Separator orientation="vertical" className="h-8" />
			<div className="flex  gap-2 md:gap-9">
				<div>
					<p>{t('totalBet')}</p>
					<p className="font-bold">
						<BetValue withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
					</p>
				</div>
				<div className=" ">
					<p>{t('payTable.potentialWin')}</p>
					<p
						className={classNames('font-bold', {
							'blur-sm': isLoading,
						})}
					>
						<BetValue withIcon value={valueToNumber(potentialWin)} />
					</p>
				</div>
			</div>
			<Separator orientation="vertical" className="h-8 mr-auto" />
			<div className=" gap-2   flex ">
				<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
					<DialogContent>
						<Paytable onClose={closePaytable} />
					</DialogContent>
				</Dialog>
				<Button onClick={openPaytable} variant={'ghost'} size="freeSize" className={'text-foreground flex-col text-xs flex items-center font-normal'}>
					<CircleHelp className={'w-6 h-6'} />
					{t('paytable')}
				</Button>

				<a
					target={'_blank'}
					href={ROULETTE_TUTORIAL}
					className={'flex flex-col  text-xs  items-center justify-center cursor-pointer text-foreground font-normal whitespace-nowrap'}
					rel="noreferrer"
				>
					<AlertCircle className={'w-6 h-6'} />
					<p>{t('howToPlay')}</p>
				</a>

				<Button
					onClick={handleReport}
					variant={'link'}
					size="freeSize"
					className={'flex-col text-accent-secondary-foreground  text-xs flex justify-start font-normal items-center  '}
				>
					<CircleAlert className={'w-6 h-6'} />
					<p>{t('report')}</p>
				</Button>
			</div>
		</div>
	);
};
