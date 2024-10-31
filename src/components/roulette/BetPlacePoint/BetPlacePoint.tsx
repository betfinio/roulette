import { useGetDebugMode, useMediaQuery } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import { motion } from 'framer-motion';
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
	const { isMobile } = useMediaQuery();

	// Mapping positions to Tailwind classes based on isMobile
	const positionClasses: Record<PositionType, string> = {
		center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
		top: ` ${!isMobile ? 'top-[-37%]' : 'top-[-50%]'} left-1/2 transform -translate-x-1/2`,
		left: `top-1/2 ${!isMobile ? '-left-[40%]' : '-left-[32%]'} transform -translate-y-1/2`,
		right: `top-1/2 ${!isMobile ? 'right-[-30%]' : 'right-[-25%]'} transform -translate-y-1/2`,
		bottom: 'bottom-[-37%] left-1/2 transform -translate-x-1/2',
		topLeft: `${!isMobile ? 'top-[-37%] -left-[40%]' : 'top-[-50%] -left-[32%]'}`,
		topRight: `${!isMobile ? 'top-[-37%] right-[-30%]' : 'top-[-50%] right-[-25%]'}`,
		bottomLeft: 'bottom-[-37%] -left-[40%] ',
		bottomRight: 'bottom-[-30%] right-[-30%] ',
	} as const;
	return (
		<motion.div
			className={cn('roulette absolute  max-w-10 aspect-square bg-muted/40  flex items-center justify-center z-10 opacity-100', positionClasses[position], {
				'bg-muted/40': isDebugMode,
				'bg-transparent': !isDebugMode,
				'w-[40%]': isMobile,
				'w-[60%]': !isMobile,
			})}
			{...events}
		>
			<BetChips positionId={positionId} />
		</motion.div>
	);
};
