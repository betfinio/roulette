import { useEffect, useRef, useState } from 'react';

export const DynamicTextSVG = ({ text }: { text: string }) => {
	const textRef = useRef<SVGTextElement>(null);
	const [viewBox, setViewBox] = useState('0 0 120 30');

	useEffect(() => {
		if (textRef.current) {
			const textWidth = textRef.current.getBBox().width; // Get the text width
			const textHeight = textRef.current.getBBox().height; // Get the text height
			const padding = 10; // Add some padding around the text

			// Update the viewBox dynamically based on the text size
			setViewBox(`0 0 ${textWidth + padding * 2} ${textHeight + padding * 2}`);
		}
	}, [text]);

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none">
			<text ref={textRef} x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xl">
				{text}
			</text>
		</svg>
	);
};
