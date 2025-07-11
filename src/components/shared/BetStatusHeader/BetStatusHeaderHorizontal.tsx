import { valueToNumber, ZeroAddress } from '@betfinio/abi';
import { Roulette } from '@betfinio/components/icons';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, DialogTrigger } from '@betfinio/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useChatbot } from 'betfinio_context/lib/context';
import { useBalance } from 'betfinio_context/lib/query';
import { AlertCircle, ArrowLeftRightIcon, CircleAlert, CircleHelp, Menu } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useGetLiveRouletteTables } from '@/src/lib/live-roulette/query';
import { usePaytable, useVisibleTable } from '@/src/lib/shared/query';
import Paytable from '../Paytable/PayTable';
import SwitchModal from '../SwitchModal';
import { BET_STATUS_HEADER } from './BetStatusHeader';
export const BetStatusHeaderHorizontal: FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation('roulette');

	const { table, isSingle } = useVisibleTable();
	const { data: liveRouletteTables = [] } = useGetLiveRouletteTables();
	const { isOpen: isPaytableOpen, openPaytable, closePaytable } = usePaytable();
	const { maximize } = useChatbot();
	const handleReport = () => {
		maximize();
	};

	const currentInterval = liveRouletteTables.find((t) => t.address === table)?.interval;

	const { data: winningPool = 0n } = useBalance(DYNAMIC_STAKING);

	const maxPayout = useMemo(() => {
		return winningPool / 20n;
	}, [winningPool]);

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

	return (
		<div
			id={BET_STATUS_HEADER}
			className=" rl:rounded-lg rl:bg-card rl:items-center rl:border rl:border-border rl:p-3 rl:px-4 rl:flex rl:justify-between rl:min-h-16 rl:gap-2 rl:md:gap-4 "
		>
			<div className="rl:flex rl:gap-2 md:gap-9">
				<div className="rl:flex rl:gap-2 rl:items-center">
					<Dialog>
						<DialogTrigger asChild>
							<div className={'rl:flex rl:gap-2 rl:md:gap-4 rl:items-center rl:cursor-pointer'}>
								<Menu className={'rl:w-8 rl:md:w-10 rl:aspect-square rl:text-foreground'} />
							</div>
						</DialogTrigger>
						<DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={'rl:w-fit '} aria-describedby={undefined}>
							<DialogTitle className={'rl:hidden'} />
							<SwitchModal onClick={handleTableSwitch} selected={isSingle ? ZeroAddress : table} tables={tablesToSwitchList} />
						</DialogContent>
						<Roulette className={'rl:w-8 rl:h-8 text-primary'} />
						<div className={''}>
							<div>{isSingle ? t('roulette') : t('liveRoulette')}</div>
							<div>
								<DialogTrigger className={'rl:text-sm rl:flex rl:items-center rl:gap-1'}>
									{currentInterval ? `${Number(currentInterval) / 60}min` : 'Single'}
									<ArrowLeftRightIcon className={'rl:w-3 h-3'} />
								</DialogTrigger>
							</div>
						</div>
					</Dialog>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="rl:text-sm">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
			</div>
			<div className=" rl:gap-2 rl:flex ">
				<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
					<DialogTitle hidden />
					<DialogContent>
						<Paytable table={table} onClose={closePaytable} />
					</DialogContent>
				</Dialog>
				<Button
					onClick={openPaytable}
					variant={'ghost'}
					size="freeSize"
					className={'rl:text-foreground rl:flex-col rl:text-xs rl:flex rl:items-center rl:font-normal'}
				>
					<CircleHelp className={'rl:w-6 rl:h-6'} />
					{t('paytable')}
				</Button>

				<a
					target={'_blank'}
					href={ROULETTE_TUTORIAL}
					className={
						'rl:flex rl:flex-col  rl:text-xs  rl:items-center rl:justify-center rl:cursor-pointer rl:text-foreground rl:font-normal rl:whitespace-nowrap'
					}
					rel="noreferrer"
				>
					<AlertCircle className={'rl:w-6 rl:h-6'} />
					<div>{t('howToPlay')}</div>
				</a>

				<Button
					onClick={handleReport}
					variant={'link'}
					size="freeSize"
					className={'rl:flex-col rl:text-primary  rl:text-xs rl:flex rl:justify-start rl:font-normal rl:items-center  '}
				>
					<CircleAlert className={'rl:w-6 rl:h-6'} />
					<div>{t('report')}</div>
				</Button>
			</div>
		</div>
	);
};
