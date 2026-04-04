import type { CellContext } from '@tanstack/react-table';
import { LiveHistoryResultCell } from '@/src/components/live-roulette/History/LiveHistoryResultCell';
import type { RoundBet } from '@/src/lib/live-roulette/types';

function WinNumber(props: CellContext<RoundBet, number>) {
	return <LiveHistoryResultCell row={props.row.original} />;
}

export default WinNumber;
