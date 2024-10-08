import { motion } from 'framer-motion';
import type { FC } from 'react';
import { BetChips } from '../BetChip/BetChips';

interface BetPlacePointProps {
	positionId: string;
	onMouseOver: (event?: React.MouseEvent) => void;
	onMouseOut: (event?: React.MouseEvent) => void;
	onClick: (event?: React.MouseEvent) => void;
}
export const BetPlacePoint: FC<BetPlacePointProps> = ({ positionId, ...events }) => {
	// Helper function to convert camelCase to kebab-case
	const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	const isDebugMode = false;
	return (
		<motion.div className={`selection-ball ${toKebabCase(positionId.split('-')[1])}-ball ${!isDebugMode ? 'hidden-balls' : ''} `} {...events}>
			<BetChips positionId={positionId} />
		</motion.div>
	);
};
