import { truncateEthAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@betfinio/components/ui';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ETHSCAN } from '@/src/global.ts';
import { useGetPlayerBets } from '@/src/lib/roulette/query';
import type { PlayerBet } from '@/src/lib/roulette/types.ts';
import { useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { BetResultCell } from '../../shared/BetResultCell';
import { RoundModal } from '../../shared/HistoryTable';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<PlayerBet>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'tables' });
	const [selected, setSelected] = useState<null | PlayerBet>(null);
	const { table } = useVisibleTable();

	const { data: bets = [], isLoading } = useGetPlayerBets(table);
	const { isVertical } = useMediaQuery();
	const columns = [
		columnHelper.accessor('bet', {
			header: t('address'),
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'rl:text-tertiary-foreground whitespace-nowrap'}>
					{truncateEthAddress(props.getValue())}
				</a>
			),
		}),
		columnHelper.accessor('created', {
			header: t('date'),
			cell: (props) => <span className={''}>{DateTime.fromMillis(Number(props.getValue()) * 1000).toFormat('DD, T:ss')}</span>,
		}),
		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={props.getValue()} />
				</span>
			),
		}),
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === RoundStatus.CREATED} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell inProgress={props.row.original.status === RoundStatus.CREATED} winNumber={props.row.original.winNumber} />,
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => (
				<>
					<Search className={'rl:w-5 rl:h-5 cursor-pointer'} onClick={() => setSelected(props.row.original)} />
				</>
			),
		}),
	] as ColumnDef<PlayerBet>[];
	const columnsMobile = [
		columnHelper.accessor('bet', {
			header: t('address'),
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'rl:text-tertiary whitespace-nowrap'}>
					{truncateEthAddress(props.getValue())}
				</a>
			),
		}),

		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={props.getValue()} />
				</span>
			),
		}),
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === RoundStatus.CREATED} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell inProgress={props.row.original.status === RoundStatus.CREATED} winNumber={props.row.original.winNumber} />,
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => <Search className={'rl:w-5 rl:h-5 rl:cursor-pointer'} onClick={() => setSelected(props.row.original)} />,
		}),
	] as ColumnDef<PlayerBet>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'rl:flex rl:justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	return (
		<div className={cn('my-4')}>
			<Dialog open={!!selected}>
				<DialogContent className="games">
					<DialogTitle className={'rl:hidden'} />
					<DialogDescription className={'rl:hidden'} />
					<RoundModal selectedBet={selected} onClose={() => setSelected(null)} />
				</DialogContent>
			</Dialog>

			<DataTable columns={isVertical ? columnsMobile : columns} data={bets} isLoading={isLoading} loaderClassName="rl:h-[285px]" t={tShared} />
		</div>
	);
};
