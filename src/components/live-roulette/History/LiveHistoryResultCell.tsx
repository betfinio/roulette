import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { Button } from '@betfinio/components/ui';
import { Loader } from 'lucide-react';
import { DateTime } from 'luxon';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '@/src/components/shared/BetResultCell';
import { LIVE_ROULETTE_WIN_UNKNOWN } from '@/src/lib/live-roulette/gql';
import { useCurrentInterval, useCurrentRound } from '@/src/lib/live-roulette/query';
import type { RoundBet } from '@/src/lib/live-roulette/types';
import { useManualSpin, useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';

type LiveHistoryBetRow = Pick<RoundBet, 'round' | 'status' | 'winNumber'>;

interface LiveHistoryResultCellProps {
	row: LiveHistoryBetRow;
}

/** Result / spin cell: never offers “spin” once `Round.winNumber` is known (awaiting settlement). */
export function LiveHistoryResultCell({ row }: LiveHistoryResultCellProps) {
	const { table = ZeroAddress } = useVisibleTable();
	const { t } = useTranslation('roulette');
	const { data: currentRound = 0 } = useCurrentRound(table);
	const { data: interval = 0 } = useCurrentInterval(table);

	const isRoundCreated = row.status === RoundStatus.CREATED;
	const isPassedRound = row.round < Number(currentRound ?? Number.NEGATIVE_INFINITY);
	const roundFinishedPlusDelayTimestamp = row.round * interval + interval + 60;
	const now = DateTime.now().toSeconds();
	const roundHasPassedPlusDelay = isPassedRound && roundFinishedPlusDelayTimestamp < now && row.status === RoundStatus.CREATED;
	const displayWin = row.winNumber;
	const winKnown = displayWin !== LIVE_ROULETTE_WIN_UNKNOWN;

	const { mutate: manualSpin, isPending } = useManualSpin(row.round);

	const handleManualSpin = (e: MouseEvent) => {
		if (isPassedRound) {
			e.stopPropagation();
			manualSpin({ table, round: BigInt(row.round) });
		}
	};

	if (!isRoundCreated) return <BetResultCell inProgress={false} winNumber={displayWin} />;

	if (winKnown)
		return (
			<div className="flex items-center justify-start min-h-10">
				<BetResultCell inProgress={false} winNumber={displayWin} />
			</div>
		);

	if (roundHasPassedPlusDelay)
		return (
			<Button disabled={isPending} onClick={handleManualSpin}>
				{isPending && <Loader className={'animate-spin absolute text-background'} />}
				<div className={cn('uppercase', { invisible: isPending })}>{t('spin')}</div>
			</Button>
		);

	return <BetResultCell inProgress={true} winNumber={displayWin} />;
}
