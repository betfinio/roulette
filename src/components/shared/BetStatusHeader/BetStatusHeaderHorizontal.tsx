import { AlertCircle, CircleAlert, CircleHelp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useGetTableAddress, useLocalBets, usePaytable } from '@/src/lib/roulette/query';
import { valueToNumber } from '@betfinio/abi';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, Separator } from '@betfinio/components/ui';
import { Bag } from '@betfinio/ui/dist/icons';
import { useChatbot } from 'betfinio_app/chatbot';
import { useBalance } from 'betfinio_app/lib/query/token';
import { type FC, useMemo } from 'react';
import Paytable from '../Paytable/PayTable';
import { BET_STATUS_HEADER } from './BetStatusHeader';

export const BetStatusHeaderHorizontal: FC = () => {
	const { t } = useTranslation('roulette');

	const { tableAddress } = useGetTableAddress();

	const { isOpen: isPaytableOpen, openPaytable, closePaytable } = usePaytable();
	const { maximize } = useChatbot();
	const handleReport = () => {
		maximize();
	};

	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);
	const { data: bets = [] } = useLocalBets();

	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);

	const maxPayout = useMemo(() => {
		return winningPool / 20n;
	}, [winningPool]);
	return (
		<div id={BET_STATUS_HEADER} className=" rounded-lg bg-card items-center border border-border p-3 px-4 flex justify-between min-h-16 gap-2 md:gap-4 ">
			<div className="flex gap-2 md:gap-9">
				<div className="flex gap-1 items-center">
					<Bag className={'w-8 text-secondary-foreground'} />
					<div>
						<div>{t('winningPool')}</div>
						<div className="font-bold">
							<BetValue withIcon value={winningPool} />
						</div>
					</div>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="font-bold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
			</div>
			<Separator orientation="vertical" className="h-8" />
			<div className="flex  gap-2 md:gap-9">
				<div>
					<div>{t('totalBet')}</div>
					<div className="font-bold">
						<BetValue withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
					</div>
				</div>
				{/* <div className=" ">
					<div>{t('payTable.potentialWin')}</div>
					<p
						className={cn('font-bold', {
							'blur-sm': isLoading,
						})}
					>
						<BetValue withIcon value={valueToNumber(potentialWin)} />
					</div>
				</div> */}
			</div>
			<Separator orientation="vertical" className="h-8 mr-auto" />
			<div className=" gap-2   flex ">
				<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
					<DialogTitle hidden />
					<DialogContent>
						<Paytable tableAddress={tableAddress} onClose={closePaytable} />
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
					<div>{t('howToPlay')}</div>
				</a>

				<Button
					onClick={handleReport}
					variant={'link'}
					size="freeSize"
					className={'flex-col text-secondary-foreground  text-xs flex justify-start font-normal items-center  '}
				>
					<CircleAlert className={'w-6 h-6'} />
					<div>{t('report')}</div>
				</Button>
			</div>
		</div>
	);
};
