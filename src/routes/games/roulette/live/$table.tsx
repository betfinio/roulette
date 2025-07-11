import { SonnerToaster } from '@betfinio/components/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { type Address, isAddress } from 'viem';
import { useConfig } from 'wagmi';
import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import Watchers from '@/src/components/live-roulette/Watchers.tsx';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import { fetchLiveRouletteTables } from '@/src/lib/live-roulette/gql';
import { fetchTableByAddress } from '@/src/lib/shared/api';

export const Route = createFileRoute('/games/roulette/live/$table')({
	component: RouletteLiveTable,
});

export function RouletteLiveTable() {
	const params = Route.useParams();
	const navigate = useNavigate();
	const search: { round: number } = Route.useSearch();
	const wagmiConfig = useConfig();

	useEffect(() => {
		async function validateAndRedirect() {
			const isValidAddress = isAddress(params.table);
			if (!isValidAddress) {
				// check if table is interval (number of seconds)
				const interval = Number(params.table);
				const tables = await fetchLiveRouletteTables();
				const table = tables.find((table) => Number(table.interval) === interval);
				if (table) {
					navigate({
						to: '/games/roulette/live/$table',
						params: { table: table.address },
						search: { round: 0 },
						replace: true,
					});
					return;
				}

				navigate({ to: '/games/roulette/live', replace: true });
				return;
			}

			const isTableExist = await fetchTableByAddress(wagmiConfig, params.table as Address);
			if (!isTableExist) {
				navigate({ to: '/not-found' });
				return;
			}

			if (!search.round) {
				const round = await fetchCurrentRoundOfTable(wagmiConfig, params.table as Address);

				navigate({
					to: '/games/roulette/live/$table',
					params: { table: params.table },
					search: { round: Number(round?.round) || 0 },
					replace: true,
				});
				return;
			}
		}

		validateAndRedirect();
	}, [params.table, search.round]);

	return (
		<div className="  ">
			<Watchers />
			<LiveRoulette />
			<SonnerToaster />
		</div>
	);
}
