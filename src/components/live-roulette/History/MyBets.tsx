import { useGetTableAddress, useGetTablePlayerRounds, useScrollToHeader } from '@/src/lib/roulette/query';
import type { RoundBet } from '@/src/lib/roulette/types';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@betfinio/components/ui';
import { Link } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '../../shared/BetResultCell';
import { RoundModal } from '../../shared/HistoryTable';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<RoundBet>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const [selected, setSelected] = useState<null | RoundBet>(null);
	const { tableAddress = ZeroAddress } = useGetTableAddress();
	const { data: bets = [], isLoading } = useGetTablePlayerRounds(tableAddress);
	const { isVertical } = useMediaQuery();
	const { scrollToHeader } = useScrollToHeader();

	const columns = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<Link to="/roulette/live/$table" onClick={scrollToHeader} search={{ round: props.getValue() }} params={{ table: tableAddress }}>
					#{props.getValue()}
				</Link>
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
			cell: (props) => <WinAmountCell amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell winNumber={props.row.original.winNumber} />,
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => (
				<>
					<Search className={'w-5 h-5 cursor-pointer'} onClick={() => setSelected(props.row.original)} />
				</>
			),
		}),
	] as ColumnDef<RoundBet>[];
	const columnsMobile = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<Link to="/roulette/live/$table" onClick={scrollToHeader} search={{ round: props.getValue() }} params={{ table: tableAddress }}>
					#{props.getValue()}
				</Link>
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
			cell: (props) => <WinAmountCell amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell winNumber={props.row.original.winNumber} />,
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => <Search className={'w-5 h-5 cursor-pointer'} onClick={() => setSelected(props.row.original)} />,
		}),
	] as ColumnDef<RoundBet>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	return (
		<div className={cn('my-4')}>
			{/* <Dialog open={!!selected}>
				<DialogContent className="games">
					<DialogTitle className={'hidden'} />
					<DialogDescription className={'hidden'} />
					<RoundModal selectedBet={selected} onClose={() => setSelected(null)} />
				</DialogContent>
			</Dialog> */}

			<DataTable columns={isVertical ? columnsMobile : columns} data={bets} isLoading={isLoading} loaderClassName="h-[285px]" />
		</div>
	);
};
