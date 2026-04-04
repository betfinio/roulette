import { SonnerToaster } from '@betfinio/components/ui';
import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { type Address, isAddress } from 'viem';
import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import Watchers from '@/src/components/live-roulette/Watchers.tsx';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import { fetchLiveRouletteTables } from '@/src/lib/live-roulette/gql';

export const Route = createFileRoute('/games/roulette/live/$table')({
	component: RouletteLiveTable,
});

export function RouletteLiveTable() {
	const params: { table: Address } = useParams({ strict: false });
	const search: { round: number } = useSearch({ strict: false });
	const navigate = useNavigate();

	useEffect(() => {
		async function validateAndRedirect() {
			// Tables are env-defined; fetch synchronously
			const tables = fetchLiveRouletteTables();

			const isValidAddress = isAddress(params.table);
			if (!isValidAddress) {
				// Accept interval number as shorthand (e.g. "300" → first matching table)
				const interval = Number(params.table);
				const table = tables.find((t) => Number(t.interval) === interval);
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

			// Validate that the address is a known configured table
			const isKnownTable = tables.some((t) => t.address.toLowerCase() === params.table.toLowerCase());
			if (!isKnownTable) {
				navigate({ to: '/not-found' });
				return;
			}

			if (!search.round) {
				const round = await fetchCurrentRoundOfTable(null as never, params.table as Address);
				navigate({
					to: '/games/roulette/live/$table',
					params: { table: params.table },
					search: { round: Number(round?.round) || 0 },
					replace: true,
				});
			}
		}

		validateAndRedirect();
	}, [params.table, search.round]);

	return (
		<div>
			<Watchers />
			<LiveRoulette />
			<SonnerToaster />
		</div>
	);
}
