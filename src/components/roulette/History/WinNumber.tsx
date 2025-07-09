import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { Button } from '@betfinio/components/ui';
import type { CellContext } from '@tanstack/react-table';
import { Loader } from 'lucide-react';
import { DateTime } from 'luxon';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BetResultCell } from '@/src/components/shared/BetResultCell.tsx';
import { useCurrentInterval, useCurrentRound } from '@/src/lib/live-roulette/query';
import type { RoundBet } from '@/src/lib/live-roulette/types.ts';
import { useManualSpin, useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types.ts';

function WinNumber(props: CellContext<RoundBet, number>) {
	const { table = ZeroAddress } = useVisibleTable();
	const { t } = useTranslation('roulette');

	const { data: currentRound = 0 } = useCurrentRound(table);
	const { data: interval = 0 } = useCurrentInterval(table);

	const isRoundCreated = (status: number) => status === RoundStatus.CREATED;
	const isPassedRound = (round: number) => round < Number(currentRound ?? Number.NEGATIVE_INFINITY);
	const roundCreated = isRoundCreated(props.row.original.status);
	const roundHasPassed = isPassedRound(props.row.original.round);
	const roundFinishedPlusDelayTimestamp = props.row.original.round * interval + interval + 60;
	const now = DateTime.now().toSeconds();
	const roundHasPassedPlusDelay = roundHasPassed && roundFinishedPlusDelayTimestamp < now && props.row.original.status === RoundStatus.CREATED;
	const { mutate: manualSpin, isPending } = useManualSpin(props.row.original.round);

	const handleManualSpin = (e: MouseEvent) => {
		if (roundHasPassed) {
			e.stopPropagation();
			manualSpin({ table, round: BigInt(props.row.original.round) });
		}
	};
	return (
		<div>
			{!roundHasPassedPlusDelay && <BetResultCell inProgress={roundCreated} winNumber={props.row.original.winNumber} />}
			{roundHasPassedPlusDelay && (
				<Button disabled={isPending} onClick={handleManualSpin}>
					{isPending && <Loader className={'rl:animate-spin rl:absolute rl:text-background'} />}
					<div className={cn('rl:uppercase', { 'rl:invisible': isPending })}>{t('spin')}</div>
				</Button>
			)}
		</div>
	);
}

export default WinNumber;
