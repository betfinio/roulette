import { useMediaQuery } from '@betfinio/components/hooks';
import { BetStatusHeaderHorizontal } from './BetStatusHeaderHorizontal';
import { BetStatusHeaderVertical } from './BetStatusHeaderVertical';

//Id for anchor
export const BET_STATUS_HEADER = 'BetStatusHeader';
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
