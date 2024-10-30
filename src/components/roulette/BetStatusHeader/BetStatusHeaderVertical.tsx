import { Roulette } from '@betfinio/ui/dist/icons';
import { BetValue } from 'betfinio_app/BetValue';
import { Button } from 'betfinio_app/button';
import { Drawer, DrawerContent, DrawerTrigger } from 'betfinio_app/drawer';
import { AlertCircle, ChartBarIcon, CircleAlert, CircleHelp } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useLocalBets, usePaytable } from '@/src/lib/roulette/query';
import { valueToNumber } from '@betfinio/abi';
import { Dialog, DialogContent } from 'betfinio_app/dialog';
import { useBalance } from 'betfinio_app/lib/query/token';
import Paytable from '../Paytable/PayTable';

export const BetStatusHeaderVertical = () => {
	const { t } = useTranslation('roulette');
	const [showDrawer, setShowDrawer] = useState(false);
	return (
		<div className="roulette">
			<div id="BetStatusHeaderVertical" className="bg-card rounded-lg border-border py-4 px-4 m-2 mb-0 border flex items-center  h-20">
				<Drawer open={showDrawer} onOpenChange={setShowDrawer}>
					<DrawerTrigger className="flex justify-between w-full gap-4 items-center">
						<div className="flex gap-2 items-center">
							<Roulette className={'w-8 md:w-10 h-8 aspect-square text-accent-secondary-foreground'} />
							<div className="flex flex-col items-start">
								<span className={'text-lg leading-0'}> {t('roulette')}</span>
								<span className={'text-sm leading-0'}> {t('singlePlayer')}</span>
							</div>
						</div>
						<ChartBarIcon className={'text-accent-secondary-foreground w-6'} />
					</DrawerTrigger>
					<DrawerContent hasLine={false}>
						<div className="bg-card py-2">
							<BetStatusHeaderVerticalDetail onCloseDrawer={() => setShowDrawer(false)} />
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</div>
	);
};

interface IBetStatusHeaderVerticalDetailsProps {
	onCloseDrawer: () => void;
}
export const BetStatusHeaderVerticalDetail: FC<IBetStatusHeaderVerticalDetailsProps> = ({ onCloseDrawer }) => {
	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);
	const { data: bets = [] } = useLocalBets();
	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);

	const maxPayout = useMemo(() => {
		return winningPool / 20n;
	}, [winningPool]);

	const { t } = useTranslation('roulette');
	const handleReport = () => {
		onCloseDrawer();
		document.getElementById('live-chat-ai-button')?.click();
	};

	const { isOpen: isPaytableOpen, openPaytable, closePaytable } = usePaytable();

	return (
		<div className="roulette text-foreground  flex   justify-between h-full  mx-auto rounded-b-md px-4 py-2">
			<div className="space-y-2">
				<div>
					<p>{t('winningPool')}</p>
					<p className="font-bold">
						<BetValue withIcon value={winningPool} />
					</p>
				</div>
				<div>
					<p>{t('maxPayout')}</p>
					<p className="font-bold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</p>
				</div>
				<div>
					<p>{t('totalBet')}</p>
					<p className="font-bold">
						<BetValue withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
					</p>
				</div>
			</div>
			<div className=" gap-2 justify-around  flex flex-col">
				<div className="flex items-center gap-x-2">
					<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
						<DialogContent>
							<Paytable onClose={closePaytable} />
						</DialogContent>
					</Dialog>
					<Button onClick={openPaytable} variant={'ghost'} className={'text-foreground text-base flex items-center gap-x-2'}>
						<CircleHelp className={'w-6 h-6'} />
						{t('paytable')}
					</Button>
				</div>
				<a
					target={'_blank'}
					href={ROULETTE_TUTORIAL}
					className={'flex gap-2  items-center justify-center cursor-pointer text-foreground px-4 whitespace-nowrap'}
					rel="noreferrer"
				>
					<AlertCircle className={'w-6 h-6'} />
					<p>{t('howToPlay')}</p>
				</a>

				<Button onClick={handleReport} variant={'link'} className={' text-accent-secondary-foreground  text-base flex justify-start items-center  gap-x-2'}>
					<CircleAlert className={'w-6'} />
					<p>{t('report')}</p>
				</Button>
			</div>
		</div>
	);
};
