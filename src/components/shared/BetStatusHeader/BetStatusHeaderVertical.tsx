import { Roulette } from '@betfinio/ui/dist/icons';

import { AlertCircle, ChartBarIcon, CircleAlert, CircleHelp } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useGetTableAddress, useLocalBets, usePaytable } from '@/src/lib/roulette/query';
import { valueToNumber } from '@betfinio/abi';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, Drawer, DrawerContent, DrawerTrigger } from '@betfinio/components/ui';
import { useChatbot } from 'betfinio_app/chatbot';
import { useBalance } from 'betfinio_app/lib/query/token';
import Paytable from '../Paytable/PayTable';
import { BET_STATUS_HEADER } from './BetStatusHeader';

export const BetStatusHeaderVertical: FC = () => {
	const { t } = useTranslation('roulette');
	const [showDrawer, setShowDrawer] = useState(false);
	return (
		<div className="roulette">
			<div id={BET_STATUS_HEADER} className="bg-card rounded-lg border-border py-4 px-4 m-2 mb-0 border flex items-center  h-20">
				<Drawer open={showDrawer} onOpenChange={setShowDrawer}>
					<DrawerTrigger className="flex justify-between w-full gap-4 items-center">
						<div className="flex gap-2 items-center">
							<Roulette className={'w-8 md:w-10 h-8 aspect-square text-secondary-foreground'} />
							<div className="flex flex-col items-start">
								<span className={'text-lg leading-0'}> {t('roulette')}</span>
								<span className={'text-sm leading-0'}> {t('singlePlayer')}</span>
							</div>
						</div>
						<ChartBarIcon className={'text-secondary-foreground w-6'} />
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
	const { tableAddress } = useGetTableAddress();

	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);
	const { data: bets = [] } = useLocalBets();
	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);
	const { maximize } = useChatbot();
	const maxPayout = useMemo(() => {
		return winningPool / 20n;
	}, [winningPool]);

	const { t } = useTranslation('roulette');
	const handleReport = () => {
		onCloseDrawer();
		maximize();
	};

	const { isOpen: isPaytableOpen, openPaytable, closePaytable } = usePaytable();

	return (
		<div id={BET_STATUS_HEADER} className="roulette text-foreground  flex   justify-between h-full  mx-auto rounded-b-md px-4 py-2">
			<div className="space-y-2">
				<div>
					<div>{t('winningPool')}</div>
					<div className="font-bold">
						<BetValue withIcon value={winningPool} />
					</div>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="font-bold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
				<div>
					<div>{t('totalBet')}</div>
					<div className="font-bold">
						<BetValue withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
					</div>
				</div>
			</div>
			<div className=" gap-2 justify-around  flex flex-col">
				<div className="flex items-center gap-x-2">
					<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
						<DialogTitle hidden />
						<DialogContent>
							<Paytable tableAddress={tableAddress} onClose={closePaytable} />
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
					<div>{t('howToPlay')}</div>
				</a>

				<Button onClick={handleReport} variant={'link'} className={' text-secondary-foreground  text-base flex justify-start items-center  gap-x-2'}>
					<CircleAlert className={'w-6'} />
					<div>{t('report')}</div>
				</Button>
			</div>
		</div>
	);
};
