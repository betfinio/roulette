import { getColor, getWheelNumbers } from '@/src/lib/roulette';
import { cn } from '@betfinio/components';

export const RouletteWheel = () => {
	const numbers = getWheelNumbers();
	const radius = 245; // Outer radius of the wheel
	const center = 250; // Center of the wheel (svg's middle point)
	const angleStep = (2 * Math.PI) / numbers.length; // Angle between each segment
	const numberOffset = 20; // Offset to move numbers lower

	// Adjust the rotation slightly (5 degrees)
	const adjustmentAngle = -5; // Angle in degrees to shift the 0 position

	return (
		<svg viewBox="0 0 500 500">
			{/* Rotate the whole wheel slightly to position the 0 at the top */}
			<g transform={`rotate(${adjustmentAngle}, ${center}, ${center})`}>
				{/* Draw each number and its triangular background */}
				{getWheelNumbers().map((number, i) => {
					const angle = i * angleStep - Math.PI / 2; // Start at the top (-90 degrees)

					const x1 = center + radius * Math.cos(angle); // Outer point of the triangle
					const y1 = center + radius * Math.sin(angle);
					const x2 = center + radius * Math.cos(angle + angleStep); // Next outer point of the triangle
					const y2 = center + radius * Math.sin(angle + angleStep);
					const xCenter = center; // Center point of the roulette wheel
					const yCenter = center;

					// Offset text toward the center to move numbers lower
					const xText = center + (radius - numberOffset) * Math.cos(angle + angleStep / 2);
					const yText = center + (radius - numberOffset) * Math.sin(angle + angleStep / 2);

					return (
						<g key={i}>
							{/* Triangular segment for the number background */}
							<polygon
								points={`${x1},${y1} ${x2},${y2} ${xCenter},${yCenter}`}
								fill="currentColor"
								className={cn({
									'text-red-roulette': getColor(+number) === 'RED',
									'text-black-roulette': getColor(+number) === 'BLACK',
									'text-green-roulette': getColor(+number) === 'GREEN',
								})}
							/>

							{/* Number in the middle of each triangle */}
							<text
								x={xText}
								y={yText}
								fill="white"
								fontSize="16"
								fontFamily="Arial"
								textAnchor="middle"
								alignmentBaseline="middle"
								transform={`rotate(${(angle * 180) / Math.PI + 90 + -adjustmentAngle}, ${xText}, ${yText})`}
							>
								{number}
							</text>
						</g>
					);
				})}
			</g>

			{/* Center circle */}
			<circle cx={center} cy={center} r={30} fill="bg-card" />
			<circle cx={center} cy={center} r={radius} strokeWidth={7} stroke="currentColor" className="text-card" fill="transparent" />
		</svg>
	);
};

export default RouletteWheel;
