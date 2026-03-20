import { cn } from '@betfinio/components';
import type { FC } from 'react';
import { getColor } from '@/src/lib/roulette';

interface RouletteNumberIconProps extends React.SVGProps<SVGSVGElement> {
	number: number;
}
export const RouletteNumberIcon: FC<RouletteNumberIconProps> = ({ number, ...props }) => {
	const color = {
		'text-[var(--red)]': getColor(number) === 'RED',
		'text-[var(--black)]': getColor(number) === 'BLACK',
		'text-[var(--green)]': getColor(number) === 'GREEN',
	};
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
			<rect width="40" height="40" rx="10" fill="currentColor" className={cn(color)} />
			<text x="20" y="25" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">
				{number}
			</text>
		</svg>
	);
};
