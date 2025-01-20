import { useGetCurrentRound, useGetSelectedRound, useGetTablePlayerRounds, useGetTableRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet } from '@/src/lib/live-roulette/types';
import { useGetTableAddress, useManualSpin, useScrollToHeader } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Button } from '@betfinio/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { type ColumnDef, type Row, createColumnHelper } from '@tanstack/react-table';
import type { Table } from '@tanstack/react-table';
import { Loader } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '../../shared/BetResultCell';
import { WinAmountCell } from '../../shared/WinAmountCell';
const columnHelper = createColumnHelper<RoundBet>();
const TABLE_ID = 'All Bets Table';
export const AllBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const { t: TPure } = useTranslation('roulette');
	const navigate = useNavigate();

	const { tableAddress = ZeroAddress } = useGetTableAddress();
	const { data: bets = [], isLoading } = useGetTableRounds(50, tableAddress || ZeroAddress);
	const { data: playerBets = [] } = useGetTablePlayerRounds(tableAddress);

	const { data } = useGetCurrentRound(tableAddress);
	const { mutateAsync: spinManually } = useManualSpin();
	const { isVertical } = useMediaQuery();
	const { scrollToHeader } = useScrollToHeader();
	const { round = 0 } = useGetSelectedRound();

	const isRoundCreated = (status: number) => status === RoundStatus.CREATED;
	const isPassedRound = (round: number) => round < Number(data?.round ?? Number.NEGATIVE_INFINITY);
	const handleManualSpin = (round: number) => {
		spinManually(
			{
				tableAddress,
				round: BigInt(round),
			},
			{
				onSuccess: () => {
					setSpinningRounds([...spinningRounds, round]);
				},
			},
		);
	};

	const tableRef = useRef<Table<RoundBet>>(null);

	const [spinningRounds, setSpinningRounds] = useState<number[]>([]);

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
						'text-secondary-foreground': !!playerRounds[props.row.original.round],
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
				const interval = Number(data?.interval ?? 0);
				const roundFinishedPlusDelayTimestamp = props.row.original.round * interval + interval + 60;
				const now = DateTime.now().toSeconds();
				const roundHasPassedPlusDelay = roundFinishedPlusDelayTimestamp < now + 60 && props.row.original.status === RoundStatus.CREATED;
				return (
					<div
						className={cn({
							'cursor-pointer': roundHasPassed,
						})}
					>
						{roundHasPassedPlusDelay ? (
							<Button onClick={() => roundHasPassed && handleManualSpin(props.row.original.round)}>Spin</Button>
						) : (
							<BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />
						)}
					</div>
				);
			},
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
			params: { table: tableAddress },
		});
		scrollToHeader();
	};

	return (
		<div id={TABLE_ID} className={cn('my-4 ')}>
			<DataTable
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
