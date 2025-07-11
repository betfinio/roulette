import { usePressAndHold } from '@betfinio/components/hooks';
import { Button } from '@betfinio/components/ui';
import { Minus, PlusIcon } from 'lucide-react';
import millify from 'millify';
import type { FC } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useChangeChip, useSelectedChip } from '@/src/lib/shared/query';
import RouletteSlider from '../RouletteSlider/RouletteSlider';

interface IRangeWithButtonsProps {
	limits: { min: number; max: number };
}

const calculateInterval = (elapsedTime: number): number => {
	const minInterval = 150;
	if (elapsedTime > 3000) {
		return minInterval;
	}
	if (elapsedTime > 1500) {
		return minInterval + 50;
	}
	if (elapsedTime > 500) {
		return minInterval + 150;
	}
	return 300;
};

const INITIAL_HOLD_DELAY = 200;

export const RangeWithButtons: FC<IRangeWithButtonsProps> = ({ limits }) => {
	const { mutate: change } = useChangeChip();
	const { data: activeChipValue = 0 } = useSelectedChip();
	const valueRef = useRef(activeChipValue);

	useEffect(() => {
		valueRef.current = activeChipValue;
	}, [activeChipValue]);

	const handlePlus = useCallback(() => {
		const currentValue = valueRef.current;
		let amount: number;
		if (currentValue < 100_000) {
			amount = limits.min;
		} else if (currentValue < 1_000_000) {
			amount = 100_000;
		} else {
			amount = 250_000;
		}

		const finalAmount = Math.min(currentValue + amount, limits.max);

		if (finalAmount !== currentValue) {
			change({ amount: finalAmount });
		}
	}, [change, limits.max, limits.min]);

	const handleMinus = useCallback(() => {
		const currentValue = valueRef.current;
		let amount: number;
		if (currentValue <= 100_000) {
			amount = limits.min;
		} else if (currentValue <= 1_000_000) {
			amount = 100_000;
		} else {
			amount = 250_000;
		}

		const finalAmount = Math.max(currentValue - amount, limits.min);

		if (finalAmount !== currentValue) {
			change({ amount: finalAmount });
		}
	}, [change, limits.min, limits.max]);

	const incrementHandlers = usePressAndHold({
		onHold: handlePlus,
		onHoldStart: handlePlus,
		initialDelay: INITIAL_HOLD_DELAY,
		interval: calculateInterval,
		minInterval: 150,
	});

	const decrementHandlers = usePressAndHold({
		onHold: handleMinus,
		onHoldStart: handleMinus,
		initialDelay: INITIAL_HOLD_DELAY,
		interval: calculateInterval,
		minInterval: 150,
	});

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
			<Button variant="secondary" {...decrementHandlers}>
				<Minus />
			</Button>
			<div className="flex flex-col mb-4 w-full">
				<div className="relative w-full flex items-center px-4">
					<RouletteSlider minPrice={limits.min} maxPrice={limits.max} marks={marks} value={activeChipValue} setSliderValue={(amount) => change({ amount })} />
				</div>
			</div>
			<Button variant="secondary" {...incrementHandlers}>
				<PlusIcon />
			</Button>
		</>
	);
};
