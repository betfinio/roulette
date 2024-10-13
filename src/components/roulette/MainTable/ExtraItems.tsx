import { useMediaQuery, usePlace } from '@/src/lib/roulette/query';
import { cn } from 'betfinio_app/lib/utils';
import type { FC } from 'react';
import TableItem from '../../TableGrid/TableItem';

const getCenterSelectionForExtraItem = (index: number, isVertical: boolean): number[] => {
	const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);

	if (isVertical) {
		if (index === 0) {
			return numbersVertical.filter((n) => (n - 1) % 3 === 0);
		}
		if (index === 1) {
			return numbersVertical.filter((n) => (n - 2) % 3 === 0);
		}
		return numbersVertical.filter((n) => n % 3 === 0);
	}
	if (index === 0) {
		return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
	}
	if (index === 1) {
		return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
	}
	return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
};

interface IExtraItemsProps {
	onHoverNumbers: (numbers: number[]) => void;
	onLeaveHover: () => void;
}
export const ExtraItems: FC<IExtraItemsProps> = ({ onHoverNumbers, onLeaveHover }) => {
	const { mutate: place } = usePlace();
	const extraItems = ['1st', '2nd', '3rd'];

	const { isVertical } = useMediaQuery();
	return (
		<>
			{extraItems.map((item, index) => (
				<TableItem
					key={item}
					number={item}
					isVertical={isVertical}
					centerSelection={getCenterSelectionForExtraItem(index, isVertical)}
					onHoverNumbers={onHoverNumbers}
					onLeaveHover={onLeaveHover}
					onClick={(position, relatedNumbers) =>
						place({
							item: `${item}-${position}`,
							numbers: relatedNumbers,
						})
					}
					className={cn(' bg-card', {
						' rounded-md w-full h-full  box-border': !isVertical,
						' rounded-md w-16 h-10  box-border': isVertical,
					})}
				/>
			))}
		</>
	);
};
