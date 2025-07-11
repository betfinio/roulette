import { valueToNumber, ZeroAddress } from '@betfinio/abi';
import { Roulette } from '@betfinio/components/icons';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, DialogTrigger, Drawer, DrawerContent, DrawerTrigger } from '@betfinio/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useChatbot } from 'betfinio_context/lib/context';
import { useBalance } from 'betfinio_context/lib/query';
import { AlertCircle, ChartBarIcon, CircleAlert, CircleHelp, Menu } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useGetLiveRouletteTables } from '@/src/lib/live-roulette/query';
import { usePaytable, useVisibleTable } from '@/src/lib/shared/query';
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

		return [
			...liveRouletteTables.map((table) => {
				return {
					address: table.address,
					interval: `${Number(table.interval) / 60}min`,
				};
			}),
			{ address: ZeroAddress, interval: '0' },
		];
	}, [liveRouletteTables]);
	const handleTableSwitch = (address: Address) => {
		if (address === ZeroAddress) {
			navigate({
				to: '/games/roulette/single',
			});
		} else {
			navigate({
				to: '/games/roulette/live/$table',
				params: { table: address },
			});
		}
	};
	const currentInterval = liveRouletteTables.find((t) => t.address === table)?.interval;
	return (
		<div className="roulette">
			<div
				id={BET_STATUS_HEADER}
				className="rl:p-3 lg:p-4 rl:mb-0 rl:border rl:border-border rl:rounded-md rl:flex rl:bg-background-lighter rl:items-center rl:gap-2"
			>
				<Dialog>
					<DialogTrigger asChild>
						<div className={'rl:flex rl:gap-2 rl:md:gap-4 rl:items-center rl:cursor-pointer'}>
							<Menu className={'rl:w-8 rl:md:w-10 rl:aspect-square rl:text-foreground'} />
						</div>
					</DialogTrigger>
					<DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={'rl:w-fit roulette'} aria-describedby={undefined}>
						<DialogTitle className={'hidden'} />
						<SwitchModal onClick={handleTableSwitch} selected={isSingle ? ZeroAddress : table} tables={tablesToSwitchList} />
					</DialogContent>
				</Dialog>
				<Drawer open={showDrawer} onOpenChange={setShowDrawer}>
					<DrawerTrigger className="rl:flex rl:justify-between rl:w-full rl:gap-4 rl:items-center">
						<div className="rl:flex rl:gap-2 rl:items-center">
							<Roulette className={'rl:w-8 rl:h-8 rl:aspect-square rl:text-primary'} />
							<div className="rl:flex rl:flex-col rl:items-start">
								<div className={'leading-none'}>{isSingle ? t('roulette') : t('liveRoulette')}</div>
								<div className={'text-xs'}>{isSingle ? t('singlePlayer') : `${Number(currentInterval) / 60}min`}</div>
							</div>
						</div>
						<ChartBarIcon className={'rl:text-primary rl:w-6'} />
					</DrawerTrigger>
					<DrawerContent hasLine={false}>
						<div className="rl:bg-card rl:py-2">
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
		<div id={BET_STATUS_HEADER} className="rl:text-foreground  rl:flex   rl:justify-between rl:h-full  rl:mx-auto rl:rounded-b-md rl:px-4 rl:py-2">
			<div className="space-y-2">
				<div>
					<div>{t('winningPool')}</div>
					<div className="rl:font-semibold">
						<BetValue withIcon value={winningPool} />
					</div>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="rl:font-semibold">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
			</div>
			<div className=" rl:gap-2 rl:justify-around  rl:flex rl:flex-col">
				<div className="rl:flex rl:items-center rl:gap-x-2">
					<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
						<DialogTitle hidden />
						<DialogContent>
							<Paytable table={table} onClose={closePaytable} />
						</DialogContent>
					</Dialog>
					<Button onClick={openPaytable} variant={'ghost'} className={'rl:text-foreground rl:text-base rl:flex rl:items-center rl:gap-x-2'}>
						<CircleHelp className={'rl:w-6 rl:h-6'} />
						{t('paytable')}
					</Button>
				</div>
				<a
					target={'_blank'}
					href={ROULETTE_TUTORIAL}
					className={'rl:flex rl:gap-2  rl:items-center rl:justify-center rl:cursor-pointer rl:text-foreground rl:px-4 rl:whitespace-nowrap'}
					rel="noreferrer"
				>
					<AlertCircle className={'rl:w-6 rl:h-6'} />
					<div>{t('howToPlay')}</div>
				</a>

				<Button onClick={handleReport} variant={'link'} className={' rl:text-primary  rl:text-base rl:flex rl:justify-start rl:items-center  rl:gap-x-2'}>
					<CircleAlert className={'rl:w-6'} />
					<div>{t('report')}</div>
				</Button>
			</div>
		</div>
	);
};
