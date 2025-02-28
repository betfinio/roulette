import { VersionValidation } from '@/src/components/VersionValidation';
import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import Watchers from '@/src/components/live-roulette/Watchers.tsx';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED } from '@/src/global';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import { fetchLiveRouletteTables } from '@/src/lib/live-roulette/gql';
import { fetchTableByAddress } from '@/src/lib/shared/api';
import { Toaster } from '@betfinio/components/ui';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { type Address, isAddress } from 'viem';
import { z } from 'zod';

const liveRouletteSchema = z.object({
	round: fallback(z.number().optional(), undefined),
});

export const validateSearch = zodValidator(liveRouletteSchema);

export const loaderDeps = ({ search }: { search: { round?: number | undefined } }) => {
	if (search?.round) {
		return { round: search.round };
	}
	return {};
};

export const onError: (e: Error) => void = (e) => {
	console.error(e, 'my error');
	throw redirect({ to: '/games/roulette' });
};

export const Route = createFileRoute('/games/roulette/live/$table')({
	component: RouletteLiveTable,
	validateSearch,
	loaderDeps,
	loader: async ({ params, context, deps }) => {
		const isValidAddress = isAddress(params.table);
		if (!isValidAddress) {
			// check if table is interval (number of seconds)
			const interval = Number(params.table);
			const tables = await fetchLiveRouletteTables();
			const table = tables.find((table) => Number(table.interval) === interval);
			if (table) {
				throw redirect({ to: '/games/roulette/live/$table', params: { table: table.address } });
			}
			throw redirect({ to: '/games/roulette/live' });
		}

		const isTableExist = await fetchTableByAddress(context.wagmiConfig, params.table as Address);
		if (!isTableExist) {
			throw redirect({ to: '/games/roulette' });
		}

		if (!deps.round) {
			const round = await fetchCurrentRoundOfTable(context.wagmiConfig, params.table as Address);

			throw redirect({
				to: '/games/roulette/live/$table',
				params: { table: params.table },
				search: { round: Number(round?.round) },
			});
		}
	},
	onError,
});

export const loader = Route.options.loader;

export function RouletteLiveTable() {
	return (
		<div className="roulette">
			<Watchers />
			<LiveRoulette />
			<Toaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</div>
	);
}
