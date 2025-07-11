import { cn } from '@betfinio/components/lib';
import { DialogClose } from '@betfinio/components/ui';
import type { FC } from 'react';
import type { Address } from 'viem';

export interface ITableSwitchItem {
	interval: string;
	address: Address;
}

interface ISwitchModalProsp {
	selected: Address;
	onClick: (address: Address) => void;
	tables: ITableSwitchItem[];
}
const SwitchModal: FC<ISwitchModalProsp> = ({ selected, onClick, tables }) => {
	return (
		<div className={' rl:p-2 rl:w-[300px]  rl:mx-auto rl:text-foreground rl:flex rl:flex-col rl:gap-1 rl:items-center'}>
			{tables.map((table, index) => (
				<DialogClose asChild key={index}>
					<div
						onClick={() => onClick(table.address)}
						className={cn(
							'rl:flex rl:flex-row rl:items-center rl:gap-2 rl:rounded-md rl:w-full rl:p-4 rl:py-2 rl:cursor-pointer rl:hover:bg-background-lighter',
							{
								'rl:border-border rl:border rl:bg-background-lighter ': table.address === selected,
							},
						)}
					>
						{table.interval === '0' ? 'Single' : table.interval}
					</div>
				</DialogClose>
			))}
		</div>
	);
};
export default SwitchModal;
