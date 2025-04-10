import WinNumber from '@/src/components/roulette/History/WinNumber.tsx';
import { useGetSelectedRound, useTablePlayerRounds, useTableRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet } from '@/src/lib/live-roulette/types';
import { useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { useNavigate } from '@tanstack/react-router';
import type { Table } from '@tanstack/react-table';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<RoundBet>();
const TABLE_ID = 'All Bets Table';
export const AllBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'tables' });
	const navigate = useNavigate();

	const { table = ZeroAddress } = useVisibleTable();
	const { data: bets = [], isLoading } = useTableRounds(table || ZeroAddress);
	const { data: playerBets = [] } = useTablePlayerRounds(table);

	const { isVertical } = useMediaQuery();
	const { scrollToHeader } = useScrollToHeader();
	const { round = 0 } = useGetSelectedRound();

	const tableRef = useRef<Table<RoundBet>>(null);

	const playerRounds = useMemo(() => {
		return playerBets.reduce(
			(acc, bet) => {
				if (!acc[bet.round]) {
					acc[bet.round] = true;
				}
				return acc;
			},
			{} as Record<number, boolean>,
		);
	}, [playerBets]);

	const columns = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<span
					className={cn({
						'text-primary': !!playerRounds[props.row.original.round],
					})}
				>
					#{props.getValue()}
				</span>
			),
		}),
		columnHelper.accessor('created', {
			header: t('date'),
			cell: (props) => <span className={''}>{DateTime.fromMillis(Number(props.getValue()) * 1000).toFormat('DD, T')}</span>,
		}),
		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <WinNumber {...props} />,
		}),
	] as ColumnDef<RoundBet>[];

	const columnsMobile = [
		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <WinNumber {...props} />,
		}),
	] as ColumnDef<RoundBet>[];

	useEffect(() => {
		const rowIndex = bets.findIndex((bet) => bet.round === round);

		tableRef.current?.setState((state) => {
			return { ...state, rowSelection: { [rowIndex]: true } };
		});
	}, [bets, round]);

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	const handleNavigateToTheRound = (row: RoundBet) => {
		navigate({
			to: '/games/roulette/live/$table',
			search: { round: row.round },
			params: { table: table },
		});
		scrollToHeader();
	};

	return (
		<div id={TABLE_ID} className={cn('my-4 ')}>
			<DataTable
				t={tShared}
				tableRef={tableRef}
				columns={isVertical ? columnsMobile : columns}
				data={bets}
				isLoading={isLoading}
				loaderClassName="h-[285px]"
				onRowClick={handleNavigateToTheRound}
			/>
		</div>
	);
};
