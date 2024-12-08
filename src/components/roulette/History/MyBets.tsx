import { ETHSCAN } from '@/src/global.ts';
import { useGetPlayerBets } from '@/src/lib/roulette/query';
import type { PlayerBets, RouletteBet } from '@/src/lib/roulette/types.ts';
import { truncateEthAddress, valueToNumber } from '@betfinio/abi';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@betfinio/components/ui';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { BetResultCell } from '../../shared/BetResultCell';
import { WinAmountCell } from '../../shared/WinAmountCell';
import { RoundModal } from './HistoryTable';

const columnHelper = createColumnHelper<PlayerBets>();

export const MyBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const [selected, setSelected] = useState<null | PlayerBets>(null);

	const { data: bets = [], isLoading } = useGetPlayerBets();
	const { isVertical } = useMediaQuery();
	const columns = [
		columnHelper.accessor('bet', {
			header: t('address'),
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'text-tertiary-foreground whitespace-nowrap'}>
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
	] as ColumnDef<PlayerBets>[];
	const columnsMobile = [
		columnHelper.accessor('bet', {
			header: t('address'),
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'text-tertiary whitespace-nowrap'}>
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
	] as ColumnDef<PlayerBets>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>{t('noBetsYet')}</div>;
	}

	return (
		<div className={cn('my-4')}>
			<Dialog open={!!selected}>
				<DialogContent className="games">
					<DialogTitle className={'hidden'} />
					<DialogDescription className={'hidden'} />
					<RoundModal selectedBet={selected} onClose={() => setSelected(null)} />
				</DialogContent>
			</Dialog>

			<DataTable columns={isVertical ? columnsMobile : columns} data={bets} isLoading={isLoading} loaderClassName="h-[285px]" />
		</div>
	);
};
