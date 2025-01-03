import { useGetCurrentRound, useGetTableRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet } from '@/src/lib/live-roulette/types';
import { useGetTableAddress, useManualSpin, useScrollToHeader } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Link } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '../../shared/BetResultCell';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<RoundBet>();

export const AllBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });

	const { tableAddress = ZeroAddress } = useGetTableAddress();
	const { data: bets = [], isLoading } = useGetTableRounds(50, tableAddress || ZeroAddress);
	const { data } = useGetCurrentRound(tableAddress);
	const { mutateAsync: spinManually } = useManualSpin();
	const { isVertical } = useMediaQuery();
	console.log(data, 'data');
	const { scrollToHeader } = useScrollToHeader();

	const isRoundCreated = (status: number) => status === RoundStatus.CREATED;
	const isPassedRound = (round: number) => round < Number(data?.round ?? Number.NEGATIVE_INFINITY);
	const handleManualSpin = (round: number) => {
		spinManually({
			tableAddress,
			round: BigInt(round),
		});
	};

	const columns = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<Link to="/roulette/live/$table" onClick={scrollToHeader} resetScroll search={{ round: props.getValue() }} params={{ table: tableAddress }}>
					#{props.getValue()}
				</Link>
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
			cell: (props) => {
				const roundCreated = isRoundCreated(props.row.original.status);
				const roundHasPassed = isPassedRound(props.row.original.round);
				return (
					<div
						onClick={() => roundHasPassed && handleManualSpin(props.row.original.round)}
						className={cn({
							'cursor-pointer': roundHasPassed,
						})}
					>
						<BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />
					</div>
				);
			},
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
			cell: (props) => {
				const roundCreated = isRoundCreated(props.row.original.status);
				const roundHasPassed = isPassedRound(props.row.original.round);
				return (
					<div
						onClick={() => roundHasPassed && handleManualSpin(props.row.original.round)}
						className={cn({
							'cursor-pointer': roundHasPassed,
						})}
					>
						<BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />
					</div>
				);
			},
		}),
	] as ColumnDef<RoundBet>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	return (
		<div className={cn('my-4')}>
			<DataTable columns={isVertical ? columnsMobile : columns} data={bets} isLoading={isLoading} loaderClassName="h-[285px]" />
		</div>
	);
};
