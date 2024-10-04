import { useWheel } from '@/src/contexts/WheelContext';
import { BetStatusHeaderHorizontal } from './BetStatusHeaderHorizontal';
import { BetStatusHeaderVertical } from './BetStatusHeaderVertical';

const BetStatusHeader: React.FC = () => {
	const { isVertical } = useWheel();

	if (!isVertical) {
		return <BetStatusHeaderHorizontal />;
	}

	if (isVertical) {
		return <BetStatusHeaderVertical />;
	}
};

export default BetStatusHeader;