import { Slider } from '@betfinio/components/ui';
import type { FC } from 'react';

// Define the type for each mark (value and its position on the slider)
type Mark = {
	value: number;
	label: string; // Label to display for the mark
};

interface RouletteSliderProps {
	minPrice: number;
	maxPrice: number;
	marks: Mark[]; // Array of mark values like [10000, 20000, 30000, etc.]
	setSliderValue: (value: number) => void;
	value: number;
}

const RouletteSlider: FC<RouletteSliderProps> = ({ minPrice, maxPrice, marks, value, setSliderValue }) => {
	// Default slider value (set to mid-range value)

	// Calculate the position of each mark relative to the min/max range
	const markPositions = marks.map((mark) => ({
		...mark,
		position: ((mark.value - minPrice) / (maxPrice - minPrice)) * 100, // Percent position
	}));

	// Function to handle slider value change
	const handleSliderChange = (value: number) => {
		setSliderValue(value);
	};

	// Function to handle clicking on marks
	const handleMarkClick = (markValue: number) => {
		setSliderValue(markValue);
	};

	return (
		<div className=" rl:w-full rl:mt-6">
			{/* Slider */}

			<Slider
				min={minPrice}
				max={maxPrice}
				step={minPrice}
				value={[value]}
				onValueChange={([value]) => handleSliderChange(value)}
				className="rl:w-full rl:h-2 rl:bg-card-secondary/20 rl:rounded-full rl:relative"
			/>

			{/* Marks for each value */}
			<div className="rl:relative rl:w-full rl:flex rl:justify-between rl:mt-3">
				{markPositions.map((mark) => (
					<div
						key={mark.value}
						className="rl:absolute rl:text-sm rl:text-tertiary-foreground rl:cursor-pointer"
						style={{
							left: `${mark.position}%`,
							transform: 'translateX(-50%)',
						}}
						onClick={() => handleMarkClick(mark.value)} // Click handler for marks
					>
						{mark.label} {/* Formats the number with commas */}
					</div>
				))}
			</div>
		</div>
	);
};

export default RouletteSlider;
