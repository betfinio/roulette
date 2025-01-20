import { positionClasses } from '@/src/components/shared/utils.ts';
import { useGetDebugMode } from '@/src/lib/shared/query';
import { cn } from '@betfinio/components';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@betfinio/components/ui';
import React, { type FC, type MouseEvent } from 'react';
import { BetChips } from '../BetChip/BetChips';

export type PositionType = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface BetPlacePointProps {
	positionId: string;
	position: PositionType;
	onMouseOver: (event?: MouseEvent) => void;
	onMouseOut: (event?: MouseEvent) => void;
	onClick: (event?: MouseEvent) => void;
	onContextMenu: (event?: MouseEvent) => void;
}
export const BetPlacePoint: FC<BetPlacePointProps> = ({ positionId, position, ...events }) => {
	const { data: isDebugMode } = useGetDebugMode();

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
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
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	);
};
