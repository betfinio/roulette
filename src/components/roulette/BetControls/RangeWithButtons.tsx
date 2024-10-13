import { useChangeChip, useSelectedChip } from '@/src/lib/roulette/query';
import { Button } from 'betfinio_app/button';
import { CircleX, Minus, PlusIcon, Undo2 } from 'lucide-react';
import { type FC, useRef, useState } from 'react';

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
	return (
		<>
			<Button variant="tertiary" onMouseDown={() => startIncrement('decrease')} onMouseUp={stopIncrement} onMouseLeave={stopIncrement} onClick={handleMinus}>
				<Minus />
			</Button>
			<div className="flex flex-col mb-4">
				<div className="flex justify-between  text-[9px] md:text-xs mb-1 px-2">
					<span>1k</span>
					<span>5k</span>
					<span>10k</span>
					<span>50k</span>
					<span>100k</span>
				</div>
				<div className="relative w-full flex items-center">
					<input
						type="range"
						min="1"
						max="100"
						step="1"
						value={activeChipValue / 1000}
						//   onChange={handleChipChange}
						className="w-full h-[2px] appearance-none bg-background cursor-pointer accent-[var(--yellow)]"
					/>
				</div>
			</div>
			<Button variant="tertiary" onMouseDown={() => startIncrement('increase')} onMouseUp={stopIncrement} onMouseLeave={stopIncrement} onClick={handlePlus}>
				<PlusIcon />
			</Button>
		</>
	);
};
