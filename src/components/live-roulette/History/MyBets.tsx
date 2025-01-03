import { useGetTablePlayerRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet, RoundPlayerBet } from '@/src/lib/live-roulette/types';
import { useGetTableAddress, useScrollToHeader } from '@/src/lib/shared/query';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Link } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '../../shared/BetResultCell';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<RoundPlayerBet>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
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
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell inProgress={props.row.original.status === 1} winNumber={props.row.original.winNumber} />,
		}),
	] as ColumnDef<RoundPlayerBet>[];
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
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => <BetResultCell inProgress={props.row.original.status === 1} winNumber={props.row.original.winNumber} />,
		}),
	] as ColumnDef<RoundPlayerBet>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	return (
		<div className={cn('my-4')}>
			<DataTable columns={isVertical ? columnsMobile : columns} data={bets} isLoading={isLoading} loaderClassName="h-[285px]" />
		</div>
	);
};
