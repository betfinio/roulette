import type React from 'react';

import type { IRouletteLanguageKeys } from '@/src/i18next';
import { cn } from '@betfinio/components';
import { isNaN as _isNaN } from 'lodash';
import { useTranslation } from 'react-i18next';
import { BetPlacePoint, type PositionType } from './BetPlacePoint/BetPlacePoint';

interface TableItemProps {
	number: string;
	centerSelection?: number[];
	topSelection?: number[];
	leftSelection?: number[];
	rightSelection?: number[];
	bottomSelection?: number[];
	topLeftSelection?: number[];
	topRightSelection?: number[];
	bottomLeftSelection?: number[];
	bottomRightSelection?: number[];
	isRangeButton?: boolean;
	isZero?: boolean;
	isVertical: boolean;
	className?: string;
	onHoverNumbers?: (numbers: number[]) => void;
	onLeaveHover?: () => void;

	onClick?: (position: string, relatedNumbers: number[], number: string | number) => void;
	onContextMenu?: (position: string, relatedNumbers: number[], number: string | number) => void;
}

const TableItem: React.FC<TableItemProps> = ({
	number,
	centerSelection,
	topSelection,
	leftSelection,
	rightSelection,
	bottomSelection,
	topLeftSelection,
	topRightSelection,
	bottomLeftSelection,
	bottomRightSelection,

	isVertical = true,
	className = '',
	isRangeButton = false,
	onHoverNumbers,
	onLeaveHover,
	onContextMenu,
	onClick,
}) => {
	const { t } = useTranslation('roulette', { keyPrefix: 'betTable' });
	const positions: PositionType[] = ['center', 'top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

	const selectionMap: Record<PositionType, number[] | undefined> & { [key: string]: number[] | undefined } = {
		center: centerSelection,
		top: topSelection,
		left: leftSelection,
		right: rightSelection,
		bottom: bottomSelection,
		topLeft: topLeftSelection,
		topRight: topRightSelection,
		bottomLeft: bottomLeftSelection,
		bottomRight: bottomRightSelection,
	};

	const hasOnlyCenterSelection = Object.keys(selectionMap).every((selection) => {
		if (selection === 'center') {
			return selectionMap[selection]?.length;
		}
		return !selectionMap[selection]?.length;
	});

	const handleInteraction = (position: PositionType, action: 'hover' | 'leave' | 'click' | 'contextMenu', event?: React.MouseEvent) => {
		event?.stopPropagation();
		const relatedNumbers = selectionMap[position];
		switch (action) {
			case 'hover':
				relatedNumbers && onHoverNumbers?.(relatedNumbers);
				break;
			case 'leave':
				onLeaveHover?.();
				break;
			case 'click':
				relatedNumbers && onClick?.(position, relatedNumbers, `${number}-${position}`);
				break;
			case 'contextMenu':
				event?.preventDefault();
				relatedNumbers && onContextMenu?.(position, relatedNumbers, `${number}-${position}`);
				break;
		}
	};

	return (
		<div
			className={cn(
				'text-xs  xl:text-base cursor-pointer relative flex items-center justify-center',
				{
					' w-10 h-full rounded-lg border border-border ': isRangeButton && isVertical,
					' w-full': isRangeButton && !isVertical,
					' w-full  rounded-lg border border-border  font-semibold': !isRangeButton && !isVertical,
					' w-full h-10 rounded-lg border border-border  font-semibold': !isRangeButton && isVertical,
				},
				className,
			)}
			onMouseOver={(e) => handleInteraction('center', 'hover', e)}
			onMouseOut={(e) => handleInteraction('center', 'leave', e)}
			onClick={() => hasOnlyCenterSelection && handleInteraction('center', 'click')}
		>
			{/* Number Display */}
			<div
				className={cn({
					'rotate-90 whitespace-nowrap': isVertical && isRangeButton,
				})}
			>
				{number !== 'Black' && number !== 'Red' ? (!_isNaN(+number) ? number : t(number as keyof IRouletteLanguageKeys['betTable'])) : ''}
			</div>

			{/* Render Selection Balls */}

			{positions.map((position, index) => {
				const selection = selectionMap[position];
				if (!selection?.length) return null;

				return (
					<BetPlacePoint
						key={index}
						positionId={`${number}-${position}`}
						position={position}
						onMouseOver={(e) => handleInteraction(position, 'hover', e)}
						onMouseOut={(e) => handleInteraction(position, 'leave', e)}
						onClick={(e) => handleInteraction(position, 'click', e)}
						onContextMenu={(e) => handleInteraction(position, 'contextMenu', e)}
					/>
				);
			})}
		</div>
	);
};

export default TableItem;
