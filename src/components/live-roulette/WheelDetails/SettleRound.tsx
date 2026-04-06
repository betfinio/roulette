import { ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { Button } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from 'wagmi';
import { settleMultiplayerRound } from '@/src/lib/live-roulette/api';
import { useGetSelectedRound, useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useVisibleTable } from '@/src/lib/shared/query';

interface SettleRoundProps {
	/** Extra classes for the outer wrapper (layout in modal vs table strip). */
	className?: string;
}

export function SettleRound({ className }: SettleRoundProps) {
	const { t } = useTranslation('roulette');
	const config = useConfig();
	const queryClient = useQueryClient();
	const { table = ZeroAddress } = useVisibleTable();
	const { round } = useGetSelectedRound();
	const { state } = useLiveRouletteState();
	const [isPending, setIsPending] = useState(false);

	if (state.data.state !== WheelStatus.ResultReadyAwaitingSettlement || !round) return null;

	async function handleSettle() {
		if (table === ZeroAddress) return;
		setIsPending(true);
		try {
			await settleMultiplayerRound(config, table, round);
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'status', table, round] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'winNumber', table, round] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'table', 'rounds', table] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'player'] });
			await queryClient.invalidateQueries({ queryKey: ['live-roulette', 'state', round, table] });
		} finally {
			setIsPending(false);
		}
	}

	return (
		<div className={cn('flex flex-col gap-2 items-center w-full max-w-[min(100%,280px)] mx-auto', className)}>
			<p className="text-[10px] md:text-xs text-muted-foreground leading-snug">{t('settleRoundHint')}</p>
			<Button type="button" variant="secondary" size="sm" disabled={isPending} onClick={() => void handleSettle()}>
				{isPending ? t('settleRoundPending') : t('settleRound')}
			</Button>
		</div>
	);
}
