import { VersionValidation } from '@/src/components/VersionValidation';
import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import Watchers from '@/src/components/live-roulette/Watchers.tsx';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED } from '@/src/global';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import { fetchTableByAddress } from '@/src/lib/shared/api';
import { Toaster } from '@betfinio/components/ui';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { type Address, isAddress } from 'viem';
import { z } from 'zod';

const liveRouletteSchema = z.object({
	round: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute('/games/roulette/live/$table')({
	component: RouletteLiveTable,
	validateSearch: zodValidator(liveRouletteSchema),
	loaderDeps: ({ search }) => {
		if (search?.round) {
			return { round: search.round };
		}
		return {};
	},
	loader: async ({ params, context, deps }) => {
		const isValidAddress = isAddress(params.table);
		if (!isValidAddress) {
			throw redirect({ to: '/games/roulette' });
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
	onError: (e) => {
		console.error(e, 'my error');
		throw redirect({ to: '/games/roulette' });
	},
});

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
