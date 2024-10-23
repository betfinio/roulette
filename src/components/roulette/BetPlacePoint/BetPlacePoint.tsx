import { useGetDebugMode } from '@/src/lib/roulette/query';
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
}
export const BetPlacePoint: FC<BetPlacePointProps> = ({ positionId, position, ...events }) => {
	const { data: isDebugMode } = useGetDebugMode();

	// Mapping positions to Tailwind classes
	const positionClasses: Record<PositionType, string> = {
		center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
		top: 'top-[-13px] left-1/2 transform -translate-x-1/2',
		left: 'top-1/2 -left-[30%] transform -translate-y-1/2 ',
		right: 'top-1/2 right-[-12px] transform -translate-y-1/2',
		bottom: 'bottom-[-11.7px] left-1/2 transform -translate-x-1/2',
		topLeft: 'top-[-13px] -left-[30%]',
		topRight: 'top-[-13px] right-[-12px]',
		bottomLeft: 'bottom-[-11.7px] -left-[30%]',
		bottomRight: 'bottom-[-11.7px] right-[-12px]',
	} as const;
	return (
		<motion.div
			className={cn(
				'absolute w-[40%] max-w-10 aspect-square bg-muted/40 rounded-full flex items-center justify-center z-10 opacity-100',
				positionClasses[position],
				{
					'bg-muted/40': isDebugMode,
					'bg-transparent': !isDebugMode,
				},
			)}
			{...events}
		>
			<BetChips positionId={positionId} />
		</motion.div>
	);
};
