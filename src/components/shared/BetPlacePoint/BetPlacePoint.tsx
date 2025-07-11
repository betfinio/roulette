import { cn } from '@betfinio/components';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@betfinio/components/ui';
import type { FC, MouseEvent } from 'react';
import { positionClasses } from '@/src/components/shared/utils.ts';
import { useGetDebugMode } from '@/src/lib/shared/query';
import { BetChips } from '../BetChip/BetChips';

export type PositionType = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface BetPlacePointProps {
	positionId: string;
	position: PositionType;
	onMouseOver: (event?: MouseEvent) => void;
	onMouseOut: (event?: MouseEvent) => void;
	onClick: (event?: MouseEvent) => void;
	onContextMenu: (event?: MouseEvent) => void;
	winNumber?: number;
}
export const BetPlacePoint: FC<BetPlacePointProps> = ({ positionId, position, winNumber, ...events }) => {
	const { data: isDebugMode } = useGetDebugMode();

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<div
						className={cn(
							'rl:absolute rl:w-[40%]  rl:sm:w-[60%] rl:max-w-10 rl:aspect-square rl:bg-muted/40  rl:flex rl:items-center rl:justify-center rl:z-10',
							positionClasses[position],
							{
								'rl:bg-muted/40': isDebugMode,
								'rl:bg-transparent': !isDebugMode,
							},
						)}
						{...events}
					>
						<BetChips positionId={positionId} winNumber={winNumber} />
					</div>
				</TooltipTrigger>
			</Tooltip>
		</TooltipProvider>
	);
};
