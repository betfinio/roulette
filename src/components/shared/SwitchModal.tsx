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
		<div className={'rounded-lg border-border border bg-background p-2 w-[300px]  mx-auto text-foreground'}>
			{tables.map((table, index) => (
				<DialogClose asChild key={index}>
					<div
						onClick={() => onClick(table.address)}
						className={cn('flex flex-row items-center gap-2 p-4 py-2', {
							'border-border border bg-background-lighter rounded-lg': table.address === selected,
						})}
					>
						{table.interval}
					</div>
				</DialogClose>
			))}
		</div>
	);
};
export default SwitchModal;
