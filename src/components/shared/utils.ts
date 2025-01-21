import type { PositionType } from '@/src/components/shared/BetPlacePoint/BetPlacePoint.tsx';

export const positionClasses: Record<PositionType, string> = {
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
