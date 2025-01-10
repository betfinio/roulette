import { useGetCurrentRound, useGetSelectedRound, useGetTablePlayerRounds } from '@/src/lib/live-roulette/query';
import type { RoundBet, RoundPlayerBet } from '@/src/lib/live-roulette/types';
import { useGetTableAddress, useManualSpin, useScrollToHeader } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
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
	const { round = 0 } = useGetSelectedRound();
	const { mutateAsync: spinManually } = useManualSpin();
	const { data } = useGetCurrentRound(tableAddress);

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
				<Link
					className={cn({
						'text-secondary-foreground': props.row.original.round === round,
					})}
					to="/games/roulette/live/$table"
					onClick={scrollToHeader}
					search={{ round: props.getValue() }}
					params={{ table: tableAddress }}
				>
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
	] as ColumnDef<RoundPlayerBet>[];
	const columnsMobile = [
		columnHelper.accessor('round', {
			header: t('round'),
			cell: (props) => (
				<Link to="/games/roulette/live/$table" onClick={scrollToHeader} search={{ round: props.getValue() }} params={{ table: tableAddress }}>
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
