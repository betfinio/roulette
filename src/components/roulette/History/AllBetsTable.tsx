import { getColor } from '@/src/lib/roulette';
import { useLastRouletteBets } from '@/src/lib/roulette/query';
import type { RouletteBet } from '@/src/lib/roulette/types.ts';
import { truncateEthAddress, valueToNumber } from '@betfinio/abi';
import Fox from '@betfinio/ui/dist/icons/Fox';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { cn } from '@betfinio/components';
import { useMediaQuery } from '@betfinio/components/hooks';
import { BetValue, DataTable } from '@betfinio/components/shared';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@betfinio/components/ui';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoundModal } from './HistoryTable';

const columnHelper = createColumnHelper<RouletteBet>();

export const AllBetsTable = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });
	const [selected, setSelected] = useState<null | RouletteBet>(null);
	const { data: bets = [], isLoading } = useLastRouletteBets(50);

	const { isVertical } = useMediaQuery();

	const columns = [
		columnHelper.accessor('player', {
			header: t('player'),
			cell: (props) => (
				<div className={'flex gap-2 items-center'}>
					<Fox />
					<span className={'text-tertiary-foreground whitespace-nowrap'}>{truncateEthAddress(props.getValue())}</span>
				</div>
			),
		}),
		columnHelper.accessor('address', {
			header: t('address'),
			cell: (props) => <span className={'text-tertiary-foreground whitespace-nowrap'}>{truncateEthAddress(props.getValue())}</span>,
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
		columnHelper.accessor('result', {
			header: t('win'),
			cell: (props) => (
				<span className={cn('font-semibold text-tertiary-foreground', props.getValue() > 0n && '!text-success')}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => {
				return (
					<span
						className={cn(' w-10 h-10 rounded-xl flex justify-center font-semibold items-center p-3', {
							'bg-red-roulette': getColor(props.getValue()) === 'RED',
							'bg-black-roulette': getColor(props.getValue()) === 'BLACK',
							'bg-green-roulette': getColor(props.getValue()) === 'GREEN',
						})}
					>
						{' '}
						{props.getValue()}
					</span>
				);
			},
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => <Search className={'w-5 h-5 cursor-pointer'} onClick={() => setSelected(props.row.original)} />,
		}),
	] as ColumnDef<RouletteBet>[];
	const columnsMobile = [
		columnHelper.accessor('address', {
			header: t('address'),
			cell: (props) => <span className={'text-tertiary-foreground whitespace-nowrap'}>{truncateEthAddress(props.getValue())}</span>,
		}),

		columnHelper.accessor('amount', {
			header: t('amount'),
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('result', {
			header: t('win'),
			cell: (props) => (
				<span className={cn('font-semibold text-tertiary-foreground', props.getValue() > 0n && '!text-success')}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winNumber', {
			header: t('result'),
			cell: (props) => {
				return (
					<span
						className={cn(' w-10 h-10 rounded-xl flex justify-center font-semibold items-center p-3', {
							'bg-red-roulette': getColor(props.getValue()) === 'RED',
							'bg-black-roulette': getColor(props.getValue()) === 'BLACK',
							'bg-green-roulette': getColor(props.getValue()) === 'GREEN',
						})}
					>
						{' '}
						{props.getValue()}
					</span>
				);
			},
		}),

		columnHelper.display({
			id: 'action',
			header: '',
			cell: (props) => <Search className={'w-5 h-5 cursor-pointer'} onClick={() => setSelected(props.row.original)} />,
		}),
	] as ColumnDef<RouletteBet>[];

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
