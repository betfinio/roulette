import type { PositionType } from '@/src/components/shared/BetPlacePoint/BetPlacePoint.tsx';

export const positionClasses: Record<PositionType, string> = {
	center: 'rl:top-1/2 rl:left-1/2 rl:transform rl:-translate-x-1/2 rl:-translate-y-1/2 ',
	top: 'rl:top-[-50%]  rl:sm:top-[-37%] rl:left-1/2 rl:transform rl:-translate-x-1/2',
	left: 'rl:top-1/2 rl:sm:-left-[40%] rl:-left-[32%]  rl:transform rl:-translate-y-1/2 ',
	right: 'rl:top-1/2 rl:sm:right-[-30%] rl:right-[-25%] rl:transform rl:-translate-y-1/2',
	bottom: 'rl:bottom-[-37%] rl:left-1/2 rl:transform rl:-translate-x-1/2',
	topLeft: 'rl:sm:top-[-37%] rl:sm:-left-[40%] rl:-left-[32%]  rl:top-[-50%] ',
	topRight: 'rl:top-[-50%] rl:sm:top-[-37%] rl:sm:right-[-30%] rl:right-[-25%]  ',
	bottomLeft: 'rl:bottom-[-37%] rl:-left-[40%]',
	bottomRight: 'rl:bottom-[-30%] rl:right-[-30%]',
} as const;
