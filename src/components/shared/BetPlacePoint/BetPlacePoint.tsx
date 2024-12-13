import { useGetDebugMode } from '@/src/lib/roulette/query';
import { cn } from '@betfinio/components';
import type { FC } from 'react';
import { BetChips } from '../BetChip/BetChips';
export type PositionType = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface BetPlacePointProps {
	positionId: string;
	position: PositionType;
	onMouseOver: (event?: React.MouseEvent) => void;
	onMouseOut: (event?: React.MouseEvent) => void;
	onClick: (event?: React.MouseEvent) => void;
	onContextMenu: (event?: React.MouseEvent) => void;
}
export const BetPlacePoint: FC<BetPlacePointProps> = ({ positionId, position, ...events }) => {
	const { data: isDebugMode } = useGetDebugMode();
	const positionClasses: Record<PositionType, string> = {
		center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ',
		top: 'top-[-50%]  sm:top-[-37%] left-1/2 transform -translate-x-1/2',
		left: 'top-1/2 sm:-left-[40%] -left-[32%]  transform -translate-y-1/2 ',
		right: 'top-1/2 sm:right-[-30%] right-[-25%] transform -translate-y-1/2',
		bottom: 'bottom-[-37%] left-1/2 transform -translate-x-1/2',
		topLeft: 'sm:top-[-37%] sm:-left-[40%] -left-[32%]  top-[-50%] ',
		topRight: 'top-[-50%] sm:top-[-37%] sm:right-[-30%] right-[-25%]  ',
		bottomLeft: 'bottom-[-37%] -left-[40%]',
		bottomRight: 'bottom-[-30%] right-[-30%]',
	} as const;
	return (
		<div
			className={cn(
				'roulette absolute w-[40%]  sm:w-[60%] max-w-10 aspect-square bg-muted/40  flex items-center justify-center z-10 opacity-100',
				positionClasses[position],
				{
					'bg-muted/40': isDebugMode,
					'bg-transparent': !isDebugMode,
				},
			)}
			{...events}
		>
			<BetChips positionId={positionId} />
		</div>
	);
};
