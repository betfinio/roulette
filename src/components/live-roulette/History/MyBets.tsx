import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Link, useNavigate } from '@tanstack/react-router';
import type { Table } from '@tanstack/react-table';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetSelectedRound, useTablePlayerRounds } from '@/src/lib/live-roulette/query';
import type { RoundPlayerBet } from '@/src/lib/live-roulette/types';
import { useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { LiveHistoryResultCell } from './LiveHistoryResultCell';
import { LiveHistoryWinCell } from './LiveHistoryWinCell';

const columnHelper = createColumnHelper<RoundPlayerBet>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'tables' });
	const navigate = useNavigate();
	const { table } = useVisibleTable();
	const { data: bets = [], isLoading } = useTablePlayerRounds(table);
	const { isVertical } = useMediaQuery();
	const { scrollToHeader } = useScrollToHeader();
	const { round = 0 } = useGetSelectedRound();

	const tableRef = useRef<Table<RoundPlayerBet>>(null);

	const columns = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<span
					className={cn({
						'text-primary': true,
					})}
				>
					#{props.getValue()}
				</span>
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
		columnHelper.display({
			id: 'win',
			header: t('win'),
			cell: (props) => <LiveHistoryWinCell row={props.row.original} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <LiveHistoryResultCell row={props.row.original} />,
		}),
	] as ColumnDef<RoundPlayerBet>[];
	const columnsMobile = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<Link to="/games/roulette/live/$table" onClick={scrollToHeader} search={{ round: props.getValue() }} params={{ table: table }}>
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
		columnHelper.display({
			id: 'win',
			header: t('win'),
			cell: (props) => <LiveHistoryWinCell row={props.row.original} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <LiveHistoryResultCell row={props.row.original} />,
		}),
	] as ColumnDef<RoundPlayerBet>[];

	useEffect(() => {
		const rowIndex = bets.findIndex((bet) => bet.round === round);

		tableRef.current?.setState((state) => {
			return { ...state, rowSelection: { [rowIndex]: true } };
		});
	}, [bets, round]);

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	const handleNavigateToTheRound = (row: RoundPlayerBet) => {
		navigate({
			to: '/games/roulette/live/$table',
			search: { round: row.round },
			params: { table: table },
		});
		scrollToHeader();
	};

	return (
		<div className={cn('my-4')}>
			<DataTable
				t={tShared}
				columns={isVertical ? columnsMobile : columns}
				data={bets}
				isLoading={isLoading}
				loaderClassName="h-[285px]"
				tableRef={tableRef}
				onRowClick={handleNavigateToTheRound}
				autoResetPageIndex={false}
			/>
		</div>
	);
};
