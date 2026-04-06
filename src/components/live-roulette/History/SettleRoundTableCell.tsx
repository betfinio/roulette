import { ZeroAddress } from '@betfinio/abi';
import { Button } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from 'wagmi';
import { settleMultiplayerRound } from '@/src/lib/live-roulette/api';
import { useVisibleTable } from '@/src/lib/shared/query';

interface SettleRoundTableCellProps {
	roundId: number;
	/** From subgraph `Round.status` — avoids spin CTA when `result_ready` */
	roundSubgraphStatus?: string | null;
}

export function SettleRoundTableCell({ roundId, roundSubgraphStatus }: SettleRoundTableCellProps) {
	const { t } = useTranslation('roulette');
	const config = useConfig();
	const queryClient = useQueryClient();
	const { table = ZeroAddress } = useVisibleTable();
	const [isPending, setIsPending] = useState(false);

	if (table === ZeroAddress || roundSubgraphStatus !== 'result_ready') return null;

	async function handleSettle() {
		setIsPending(true);
		try {
			await settleMultiplayerRound(config, table, roundId);
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'status', table, roundId] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'winNumber', table, roundId] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'table', 'rounds', table] });
			await queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'player'] });
			await queryClient.invalidateQueries({ queryKey: ['live-roulette', 'state', roundId, table] });
		} finally {
			setIsPending(false);
		}
	}

	return (
		<Button type="button" variant="secondary" size="sm" className="whitespace-nowrap text-xs px-2" disabled={isPending} onClick={() => void handleSettle()}>
			{isPending ? t('settleRoundPending') : t('settleRound')}
		</Button>
	);
}
