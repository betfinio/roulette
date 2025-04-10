import { DYNAMIC_STAKING, ROULETTE_TUTORIAL } from '@/src/global';
import { useGetLiveRouletteTables } from '@/src/lib/live-roulette/query';
import { usePaytable, useVisibleTable } from '@/src/lib/shared/query';
import { valueToNumber } from '@betfinio/abi';
import { ZeroAddress } from '@betfinio/abi';
import { Roulette } from '@betfinio/components/icons';
import { BetValue } from '@betfinio/components/shared';
import { Button, Dialog, DialogContent, DialogTitle, DialogTrigger } from '@betfinio/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useChatbot } from 'betfinio_context/lib/context';
import { useBalance } from 'betfinio_context/lib/query';
import { AlertCircle, ArrowLeftRightIcon, CircleAlert, CircleHelp, Menu } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type Address, zeroAddress } from 'viem';
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
		<div id={BET_STATUS_HEADER} className=" rounded-lg bg-card items-center border border-border p-3 px-4 flex justify-between min-h-16 gap-2 md:gap-4 ">
			<div className="flex gap-2 md:gap-9">
				<div className="flex gap-2 items-center">
					<Dialog>
						<DialogTrigger asChild>
							<div className={'flex gap-2 md:gap-4 items-center cursor-pointer'}>
								<Menu className={'w-8 md:w-10 aspect-square text-foreground'} />
							</div>
						</DialogTrigger>
						<DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={'w-fit roulette '} aria-describedby={undefined}>
							<DialogTitle className={'hidden'} />
							<SwitchModal onClick={handleTableSwitch} selected={isSingle ? ZeroAddress : table} tables={tablesToSwitchList} />
						</DialogContent>
						<Roulette className={'w-8 h-8 text-primary'} />
						<div className={''}>
							<div>{isSingle ? t('roulette') : t('liveRoulette')}</div>
							<div>
								<DialogTrigger className={'text-sm flex items-center gap-1'}>
									{currentInterval ? `${Number(currentInterval) / 60}min` : 'Single'}
									<ArrowLeftRightIcon className={'w-3 h-3'} />
								</DialogTrigger>
							</div>
						</div>
					</Dialog>
				</div>
				<div>
					<div>{t('maxPayout')}</div>
					<div className="text-sm">
						<BetValue withIcon value={valueToNumber(maxPayout)} />
					</div>
				</div>
			</div>
			<div className=" gap-2 flex ">
				<Dialog open={isPaytableOpen} onOpenChange={closePaytable}>
					<DialogTitle hidden />
					<DialogContent>
						<Paytable table={table} onClose={closePaytable} />
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
					className={'flex-col text-primary  text-xs flex justify-start font-normal items-center  '}
				>
					<CircleAlert className={'w-6 h-6'} />
					<div>{t('report')}</div>
				</Button>
			</div>
		</div>
	);
};
