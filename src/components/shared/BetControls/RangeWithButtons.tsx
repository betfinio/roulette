import { useChangeChip, useSelectedChip } from '@/src/lib/roulette/query';
import { Button } from '@betfinio/components/ui';
import { Minus, PlusIcon } from 'lucide-react';
import millify from 'millify';
import { type FC, useRef, useState } from 'react';
import RouletteSlider from '../RouletteSlider/RouletteSlider';

interface IRangeWithButtonsProps {
	limits: { min: number; max: number };
}
export const RangeWithButtons: FC<IRangeWithButtonsProps> = ({ limits }) => {
	const { mutate: change } = useChangeChip();
	const { data: activeChipValue = 0 } = useSelectedChip();

	const handlePlus = () => {
		if (activeChipValue > limits.max - limits.max / 100) return;
		change({ amount: activeChipValue + limits.max / 100 });
	};

	const handleMinus = () => {
		if (activeChipValue < limits.min + limits.max / 100) return;
		change({ amount: activeChipValue - limits.max / 100 });
	};

	const [incrementSpeed, setIncrementSpeed] = useState(1);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const startIncrement = (direction: 'increase' | 'decrease') => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			direction === 'increase' ? handlePlus() : handleMinus();
			setIncrementSpeed((prev) => Math.min(prev * 1.1, 10));
		}, 200 / incrementSpeed);
	};

	const stopIncrement = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIncrementSpeed(1);
	};

	const marks = [
		{
			value: limits.min,

			label: millify(limits.min),
		},

		{
			value: limits.max / 4,
			label: millify(limits.max / 4),
		},
		{
			value: (limits.max / 4) * 2,
			label: millify((limits.max / 4) * 2),
		},
		{
			value: (limits.max / 4) * 3,
			label: millify((limits.max / 4) * 3),
		},

		{
			value: limits.max,

			label: millify(limits.max),
		},
	];

	return (
		<>
			<Button variant="secondary" onMouseDown={() => startIncrement('decrease')} onMouseUp={stopIncrement} onMouseLeave={stopIncrement} onClick={handleMinus}>
				<Minus />
			</Button>
			<div className="flex flex-col mb-4 w-full">
				<div className="relative w-full flex items-center px-4">
					<RouletteSlider minPrice={limits.min} maxPrice={limits.max} marks={marks} value={activeChipValue} setSliderValue={(amount) => change({ amount })} />
				</div>
			</div>
			<Button variant="secondary" onMouseDown={() => startIncrement('increase')} onMouseUp={stopIncrement} onMouseLeave={stopIncrement} onClick={handlePlus}>
				<PlusIcon />
			</Button>
		</>
	);
};
