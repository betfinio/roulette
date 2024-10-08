import type React from 'react';
import { useState } from 'react';
import './TableItem.css';
import { Bet } from '@betfinio/ui/dist/icons';
import { motion } from 'framer-motion';
import { BetChips } from '../roulette/BetChip/BetChips';
import { BetPlacePoint } from '../roulette/BetPlacePoint/BetPlacePoint';

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
}

type PositionType = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const MAX_CHIPS = 5;

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
	isZero = false,
	isVertical = true,
	className = '',
	isRangeButton = false,
	onHoverNumbers,
	onLeaveHover,

	onClick,
}) => {
	const positions: PositionType[] = ['center', 'top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

	const selectionMap: Record<PositionType, number[] | undefined> = {
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

	const handleInteraction = (position: PositionType, action: 'hover' | 'leave' | 'click', event?: React.MouseEvent) => {
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
		}
	};

	const containerClass = `text-xs ${
		isRangeButton
			? isVertical
				? 'table-external-item-v'
				: 'table-external-item-h '
			: isVertical
				? isZero
					? 'table-item-v-zero'
					: 'table-item-v'
				: isZero
					? 'table-item-h-zero'
					: 'table-item-h'
	} ${className}`;

	const numberDisplayClass = `${isRangeButton ? (isVertical ? 'side-item-v-text' : 'side-item-h-text') : 'number-display'}`;

	return (
		<div
			className={containerClass}
			onMouseOver={(e) => handleInteraction('center', 'hover', e)}
			onMouseOut={(e) => handleInteraction('center', 'leave', e)}
			onClick={() => handleInteraction('center', 'click')}
		>
			{/* Number Display */}
			<div className={numberDisplayClass}>{number !== 'Black' && number !== 'Red' ? number : ''}</div>

			{/* Render Selection Balls */}

			{positions.map((position) => {
				const selection = selectionMap[position];
				if (!selection?.length) return null;

				return (
					<BetPlacePoint
						key={position}
						positionId={`${number}-${position}`}
						onMouseOver={(e) => handleInteraction(position, 'hover', e)}
						onMouseOut={(e) => handleInteraction(position, 'leave', e)}
						onClick={(e) => handleInteraction(position, 'click', e)}
					/>
				);
			})}
		</div>
	);
};

export default TableItem;
