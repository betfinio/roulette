import { useGetCurrentRound, useGetSelectedRound, useTablePlayerRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet, RoundPlayerBet } from '@/src/lib/live-roulette/types';
import { useManualSpin, useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Button } from '@betfinio/components/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import type { Table } from '@tanstack/react-table';
import { Loader } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '../../shared/BetResultCell';
import { WinAmountCell } from '../../shared/WinAmountCell';

const columnHelper = createColumnHelper<RoundPlayerBet>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const { t: tShared } = useTranslation('shared', { keyPrefix: 'tables' });
	const { t: TPure } = useTranslation('roulette');
	const navigate = useNavigate();
	const { table = ZeroAddress } = useVisibleTable();
	const { data: bets = [], isLoading } = useTablePlayerRounds(table);
	const { isVertical } = useMediaQuery();
	const { scrollToHeader } = useScrollToHeader();
	const { round = 0 } = useGetSelectedRound();
	const { mutateAsync: spinManually } = useManualSpin();
	const { data } = useGetCurrentRound(table);

	const tableRef = useRef<Table<RoundPlayerBet>>(null);

	const isRoundCreated = (status: number) => status === RoundStatus.CREATED;
	const isPassedRound = (round: number) => round < Number(data?.round ?? Number.NEGATIVE_INFINITY);
	const handleManualSpin = (round: number) => {
		spinManually(
			{
				table,
				round: BigInt(round),
			},
			{
				onSuccess: () => {
					setSpinningRounds([...spinningRounds, round]);
				},
			},
		);
	};

	const [spinningRounds, setSpinningRounds] = useState<number[]>([]);

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
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => {
				const roundCreated = isRoundCreated(props.row.original.status);
				const roundHasPassed = isPassedRound(props.row.original.round);
				const interval = Number(data?.interval ?? 0);
				const roundFinishedPlusDelayTimestamp = props.row.original.round * interval + interval + 60;
				const now = DateTime.now().toSeconds();
				const roundHasPassedPlusDelay = roundHasPassed && roundFinishedPlusDelayTimestamp < now && props.row.original.status === RoundStatus.CREATED;

				const isManuallySpining = spinningRounds.includes(props.row.original.round);
				return (
					<div>
						{!roundHasPassedPlusDelay && <BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />}
						{roundHasPassedPlusDelay && (
							<Button
								disabled={isManuallySpining}
								onClick={(e) => {
									if (roundHasPassed) {
										e.stopPropagation();
										handleManualSpin(props.row.original.round);
									}
								}}
							>
								{isManuallySpining && <Loader color={'black'} className={'animate-spin absolute'} />}
								<div className={cn('uppercase', { invisible: isManuallySpining })}>{TPure('spin')}</div>
							</Button>
						)}
					</div>
				);
			},
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
		columnHelper.accessor('winAmount', {
			header: t('win'),
			cell: (props) => <WinAmountCell inProgress={props.row.original.status === 1} amount={props.row.original.winAmount} />,
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => {
				const roundCreated = isRoundCreated(props.row.original.status);
				const roundHasPassed = isPassedRound(props.row.original.round);
				const interval = Number(data?.interval ?? 0);
				const roundFinishedPlusDelayTimestamp = props.row.original.round * interval + interval + 60;
				const now = DateTime.now().toSeconds();
				const roundHasPassedPlusDelay = roundHasPassed && roundFinishedPlusDelayTimestamp < now && props.row.original.status === RoundStatus.CREATED;

				const isManuallySpining = spinningRounds.includes(props.row.original.round);
				return (
					<div>
						{!roundHasPassedPlusDelay && <BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />}
						{roundHasPassedPlusDelay && (
							<Button disabled={isManuallySpining} onClick={() => roundHasPassed && handleManualSpin(props.row.original.round)}>
								{isManuallySpining && <Loader color={'black'} className={'animate-spin absolute'} />}
								<div className={cn('uppercase', { invisible: isManuallySpining })}>{TPure('spin')}</div>
							</Button>
						)}
					</div>
				);
			},
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
			/>
		</div>
	);
};
