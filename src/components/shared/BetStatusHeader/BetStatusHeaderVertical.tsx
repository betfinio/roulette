import { Roulette } from '@betfinio/ui/dist/icons';

import { AlertCircle, ChartBarIcon, CircleAlert, CircleHelp, Menu } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useLocalBets, usePaytable, useVisibleTable } from '@/src/lib/shared/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, DialogTrigger, Drawer, DrawerContent, DrawerTrigger } from '@betfinio/components/ui';

import { useGetLiveRouletteTables } from '@/src/lib/live-roulette/query';
import { useNavigate } from '@tanstack/react-router';
import { useChatbot } from 'betfinio_context/lib/context';
import { useBalance } from 'betfinio_context/lib/query';
import type { Address } from 'viem';
import Paytable from '../Paytable/PayTable';
import SwitchModal from '../SwitchModal';
import { BET_STATUS_HEADER } from './BetStatusHeader';

export const BetStatusHeaderVertical: FC = () => {
	const navigate = useNavigate();

	const { t } = useTranslation('roulette');
	const [showDrawer, setShowDrawer] = useState(false);
	const { table, isSingle } = useVisibleTable();
	const { data: liveRouletteTables = [] } = useGetLiveRouletteTables();

	const tablesToSwitchList = useMemo(() => {
		if (!liveRouletteTables) return [];

		return liveRouletteTables.map((table) => {
			return {
				address: table.address,
				interval: `${Number(table.interval) / 60}min`,
			};
		});
	}, [liveRouletteTables]);
	const handleTableSwitch = (address: Address) => {
		navigate({
			to: '/games/roulette/live/$table',
			params: { table: address },
		});
	};
	const currentInterval = liveRouletteTables.find((t) => t.address === table)?.interval;
	return (
		<div className="roulette">
			<div id={BET_STATUS_HEADER} className="p-3 lg:p-4 mb-0 border border-border rounded-md flex bg-background-lighter items-center gap-2">
				{!isSingle && (
					<Dialog>
						<DialogTrigger asChild>
							<div className={'flex gap-2 md:gap-4 items-center cursor-pointer'}>
								<Menu className={'w-8 md:w-10 aspect-square text-foreground'} />
							</div>
						</DialogTrigger>
						<DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={'w-fit roulette'} aria-describedby={undefined}>
							<DialogTitle className={'hidden'} />
							<SwitchModal onClick={handleTableSwitch} selected={table || ZeroAddress} tables={tablesToSwitchList} />
						</DialogContent>
					</Dialog>
				)}
				<Drawer open={showDrawer} onOpenChange={setShowDrawer}>
					<DrawerTrigger className="flex justify-between w-full gap-4 items-center">
						<div className="flex gap-2 items-center">
							<Roulette className={'w-8 h-8 aspect-square text-secondary-foreground'} />
							<div className="flex flex-col items-start leading-1">
								<div className={'leading-2'}>{isSingle ? t('roulette') : t('liveRoulette')}</div>
								<div className={'text-xs'}>{isSingle ? t('singlePlayer') : `${Number(currentInterval) / 60}min`}</div>
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
	const { table } = useVisibleTable();

	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);
	const { data: bets = [] } = useLocalBets();
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
					<div className="font-semibold">
						<BetValue withIcon value={winningPool} />
					</div>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="font-semibold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
			</div>
			<div className=" gap-2 justify-around  flex flex-col">
				<div className="flex items-center gap-x-2">
					<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
						<DialogTitle hidden />
						<DialogContent>
							<Paytable table={table} onClose={closePaytable} />
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
