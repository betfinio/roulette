import { useMediaQuery } from '@/src/lib/roulette/query';
import { BetStatusHeaderHorizontal } from './BetStatusHeaderHorizontal';
import { BetStatusHeaderVertical } from './BetStatusHeaderVertical';

const BetStatusHeader: React.FC = () => {
	const { isVertical } = useMediaQuery();

	if (!isVertical) {
		return <BetStatusHeaderHorizontal />;
	}

	if (isVertical) {
		return <BetStatusHeaderVertical />;
	}
};

export default BetStatusHeader;
