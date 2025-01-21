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
		<div className={' p-2 w-[300px]  mx-auto text-foreground flex flex-col gap-1 items-center'}>
			{tables.map((table, index) => (
				<DialogClose asChild key={index}>
					<div
						onClick={() => onClick(table.address)}
						className={cn('flex flex-row items-center gap-2 rounded-md w-full p-4 py-2 cursor-pointer hover:bg-background-lighter', {
							'border-border border bg-background-lighter ': table.address === selected,
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
