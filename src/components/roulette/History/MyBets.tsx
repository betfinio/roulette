import { ETHSCAN } from '@/src/global.ts';
import { getColor } from '@/src/lib/roulette';
import { useMediaQuery, useRouletteBets } from '@/src/lib/roulette/query';
import type { RouletteBet } from '@/src/lib/roulette/types.ts';
import { ZeroAddress } from '@betfinio/abi';
import { truncateEthAddress, valueToNumber } from '@betfinio/abi';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { BetValue } from 'betfinio_app/BetValue';
import { DataTable } from 'betfinio_app/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'betfinio_app/dialog';
import cx from 'clsx';
import { Search } from 'lucide-react';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { RoundModal } from './HistoryTable';

const columnHelper = createColumnHelper<RouletteBet>();

export const MyBetsTable = () => {
	const [selected, setSelected] = useState<null | RouletteBet>(null);
	const { address = ZeroAddress } = useAccount();
	const { data: bets = [], isLoading } = useRouletteBets(address);
	const { isVertical } = useMediaQuery();
	const columns = [
		columnHelper.accessor('address', {
			header: 'Bet address',
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'text-tertiary-foreground whitespace-nowrap'}>
					{truncateEthAddress(props.getValue())}
				</a>
			),
		}),
		columnHelper.accessor('created', {
			header: 'Date',
			cell: (props) => <span className={''}>{DateTime.fromMillis(Number(props.getValue()) * 1000).toFormat('DD, T:ss')}</span>,
		}),
		columnHelper.accessor('amount', {
			header: 'Amount',
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={props.getValue()} />
				</span>
			),
		}),
		columnHelper.accessor('result', {
			header: 'Win',
			cell: (props) => (
				<span className={cx('font-semibold text-tertiary-foreground', props.getValue() > 0n && '!text-success')}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winNumber', {
			header: 'Result',
			cell: (props) => {
				return (
					<span
						className={cx(' w-10 h-10 rounded-xl flex justify-center font-semibold items-center p-3', {
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
	] as ColumnDef<RouletteBet, `0x${string}`>[];
	const columnsMobile = [
		columnHelper.accessor('address', {
			header: 'Bet address',
			cell: (props) => (
				<a target={'_blank'} rel={'noreferrer'} href={`${ETHSCAN}/address/${props.getValue()}`} className={'text-tertiary whitespace-nowrap'}>
					{truncateEthAddress(props.getValue())}
				</a>
			),
		}),

		columnHelper.accessor('amount', {
			header: 'Amount',
			cell: (props) => (
				<span className={' font-semibold'}>
					<BetValue value={props.getValue()} />
				</span>
			),
		}),
		columnHelper.accessor('result', {
			header: 'Win',
			cell: (props) => (
				<span className={cx('font-semibold text-tertiary-foreground', props.getValue() > 0n && '!text-success')}>
					<BetValue value={valueToNumber(props.getValue())} />
				</span>
			),
		}),
		columnHelper.accessor('winNumber', {
			header: 'Result',
			cell: (props) => {
				return (
					<span
						className={cx('e w-10 h-10 rounded-xl flex justify-center font-semibold items-center p-3', {
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
	] as ColumnDef<RouletteBet, `0x${string}`>[];

	if (bets.length === 0 && !isLoading) {
		return <div className={'flex justify-center p-3'}>No bets yet</div>;
	}

	return (
		<div className={cx('my-4')}>
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