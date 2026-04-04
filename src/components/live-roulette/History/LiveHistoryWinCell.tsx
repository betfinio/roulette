import { LIVE_ROULETTE_WIN_UNKNOWN } from '@/src/lib/live-roulette/gql';
import type { RoundBet } from '@/src/lib/live-roulette/types';
import { RoundStatus } from '@/src/lib/shared/types';
import { WinAmountCell } from '../../shared/WinAmountCell';
import { SettleRoundTableCell } from './SettleRoundTableCell';

type LiveHistoryWinRow = Pick<RoundBet, 'winAmount' | 'status' | 'winNumber' | 'roundSubgraphStatus' | 'round'>;

interface LiveHistoryWinCellProps {
	row: LiveHistoryWinRow;
}

/** Win column: show payout only when known; `result_ready` shows settle (payouts after settlement). */
export function LiveHistoryWinCell({ row }: LiveHistoryWinCellProps) {
	const awaitingSettlement = row.roundSubgraphStatus === 'result_ready';

	if (awaitingSettlement)
		return (
			<div className="flex flex-col gap-1 items-start min-w-0" onClick={(e) => e.stopPropagation()}>
				<SettleRoundTableCell roundId={row.round} roundSubgraphStatus={row.roundSubgraphStatus} />
			</div>
		);

	return <WinAmountCell inProgress={row.status === RoundStatus.CREATED && row.winNumber === LIVE_ROULETTE_WIN_UNKNOWN} amount={row.winAmount} />;
}
