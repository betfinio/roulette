import { cn } from '@betfinio/components';
import { isNaN as _isNaN } from 'lodash';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { IRouletteLanguageKeys } from '@/src/i18next';
import { useCurrentRound } from '@/src/lib/live-roulette/query';
import { useVisibleRound, useVisibleTable } from '@/src/lib/shared/query';
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
	winNumber?: number;
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
	winNumber,
	isVertical = true,
	className = '',
	isRangeButton = false,
	onHoverNumbers,
	onLeaveHover,
	onContextMenu,
	onClick,
}) => {
	const { table, isSingle } = useVisibleTable();
	const { data: currentRound } = useCurrentRound(table);
	const { round } = useVisibleRound();
	const { t } = useTranslation('roulette', { keyPrefix: 'betTable' });

	const isCurrentRound = Number(currentRound) === Number(round);

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
		if (round !== Number(currentRound) && !isSingle) return;
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
			data-potition-id={number}
			className={cn(
				'rl:text-xs rl:xl:text-base rl:cursor-pointer rl:relative rl:flex rl:items-center rl:justify-center',
				{
					' rl:w-10 rl:h-full rl:rounded-lg rl:border rl:border-border ': isRangeButton && isVertical,
					' rl:w-full': isRangeButton && !isVertical,
					' rl:w-full  rl:rounded-lg rl:border rl:border-border  rl:font-semibold': !isRangeButton && !isVertical,
					' rl:w-full rl:h-10 rl:rounded-lg rl:border rl:border-border  rl:font-semibold': !isRangeButton && isVertical,
				},
				className,
				{ 'rl:border-transparent': !isCurrentRound },
			)}
			onMouseOver={(e) => handleInteraction('center', 'hover', e)}
			onMouseOut={(e) => handleInteraction('center', 'leave', e)}
			onClick={() => hasOnlyCenterSelection && handleInteraction('center', 'click')}
		>
			{/* Number Display */}
			<div
				className={cn({
					'rl:rotate-90 rl:whitespace-nowrap': isVertical && isRangeButton,
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
						winNumber={winNumber}
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
