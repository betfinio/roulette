import { useChangeChip, useSelectedChip } from '@/src/lib/shared/query';
import { Button } from '@betfinio/components/ui';
import { Minus, PlusIcon } from 'lucide-react';
import millify from 'millify';
import type { FC } from 'react';
import RouletteSlider from '../RouletteSlider/RouletteSlider';

interface IRangeWithButtonsProps {
	limits: { min: number; max: number };
}

export const RangeWithButtons: FC<IRangeWithButtonsProps> = ({ limits }) => {
	const { mutate: change } = useChangeChip();
	const { data: activeChipValue = 0 } = useSelectedChip();

	const handlePlus = () => {
		let amount: number;
		if (activeChipValue < 100_000) {
			amount = limits.min;
		} else if (activeChipValue < 1_000_000) {
			amount = 100_000;
		} else {
			amount = 250_000;
		}
		if (activeChipValue + amount > limits.max) {
			amount = limits.max - activeChipValue <= 0 ? 0 : limits.max - activeChipValue;
		}
		change({ amount: activeChipValue + amount });
	};

	const handleMinus = () => {
		let amount: number;
		if (activeChipValue <= 100_000) {
			amount = limits.min;
		} else if (activeChipValue <= 1_000_000) {
			amount = 100_000;
		} else {
			amount = 250_000;
		}
		if (activeChipValue - amount < limits.min) {
			amount = activeChipValue - limits.min;
		}
		change({ amount: activeChipValue - amount });
	};

	const marks = [
		{
			value: limits.min,

			label: millify(limits.min, { precision: 2 }),
		},

		{
			value: limits.max / 4,
			label: millify(limits.max / 4, { precision: 2 }),
		},
		{
			value: (limits.max / 4) * 2,
			label: millify((limits.max / 4) * 2, { precision: 2 }),
		},
		{
			value: (limits.max / 4) * 3,
			label: millify((limits.max / 4) * 3, { precision: 2 }),
		},

		{
			value: limits.max,
			label: millify(limits.max, { precision: 2 }),
		},
	];

	return (
		<>
			<Button variant="secondary" onClick={handleMinus}>
				<Minus />
			</Button>
			<div className="flex flex-col mb-4 w-full">
				<div className="relative w-full flex items-center px-4">
					<RouletteSlider minPrice={limits.min} maxPrice={limits.max} marks={marks} value={activeChipValue} setSliderValue={(amount) => change({ amount })} />
				</div>
			</div>
			<Button variant="secondary" onClick={handlePlus}>
				<PlusIcon />
			</Button>
		</>
	);
};
