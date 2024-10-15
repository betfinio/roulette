import { Slider } from 'betfinio_app/slider';
import { type FC, useState } from 'react';

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
		setSliderValue(markValue); // Update slider value when a mark is clicked
	};

	return (
		<div className=" w-full mt-6">
			{/* Slider */}

			<Slider
				min={minPrice}
				max={maxPrice}
				step={1}
				value={[value]}
				onValueChange={([value]) => handleSliderChange(value)}
				className="w-full h-2 bg-gray-300 rounded-full relative"
			/>

			{/* Vertical lines on the slider for each mark
      <div className="relative w-full ">
        {markPositions.map((mark) => (
          <div
            key={mark.value}
            className="absolute bg-gray-500 h-4 w-3"
            style={{
              left: `calc(${mark.position}%)`,
              top: '-4px', // Adjusts the vertical positioning
          width: '1px',
              height: '10px',
              transform: "translateX(-50%)",
            }}
          />
        ))}
      </div> */}

			{/* Marks for each value */}
			<div className="relative w-full flex justify-between mt-3">
				{markPositions.map((mark) => (
					<div
						key={mark.value}
						className="absolute text-sm text-gray-500 cursor-pointer"
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
