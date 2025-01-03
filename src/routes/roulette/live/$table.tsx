import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import { PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import { useFetchTableBetsByBlockHash } from '@/src/lib/live-roulette/query';
import { fetchTableByAddress } from '@/src/lib/shared/api';
import { useGetTableAddress, useRouletteState } from '@/src/lib/shared/query';
import { LiveRouletteABI } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { type Address, isAddress } from 'viem';
import { useWatchContractEvent } from 'wagmi';
import { z } from 'zod';
const liveRouletteSchema = z.object({
	round: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute('/roulette/live/$table')({
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
			throw redirect({ to: '/roulette' });
		}

		const isTableExist = await fetchTableByAddress(context.wagmiConfig, params.table as Address);
		if (!isTableExist) {
			throw redirect({ to: '/roulette' });
		}
		console.log(deps, 'deps');
		if (!deps.round) {
			const round = await fetchCurrentRoundOfTable(context.wagmiConfig, params.table as Address);
			console.log(round, 'round');
			throw redirect({ to: `/roulette/live/${params.table}`, search: { round: Number(round?.round) } });
		}
	},
	onError: (e) => {
		console.error(e, 'my error');
		throw redirect({ to: '/roulette' });
	},
});

function RouletteLiveTable() {
	const queryClient = useQueryClient();
	const { updateState } = useRouletteState();
	const { tableAddress } = useGetTableAddress();
	const { mutateAsync: fetchTableBetsByBlockHash } = useFetchTableBetsByBlockHash();

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		onLogs: async (rolledLogs) => {
			const eventOfTheTable = rolledLogs[0].args.table?.toString().toLowerCase() === tableAddress?.toLowerCase();
			if (eventOfTheTable) {
				updateState({ state: 'spinning' });
			}
		},
	});

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		onLogs: async (landedLogs) => {
			const eventOfTheTable = landedLogs[0].args.table?.toString().toLowerCase() === tableAddress?.toLowerCase();
			const tableRound = landedLogs[0].args.round;

			if (eventOfTheTable) {
				const round = await fetchTableBetsByBlockHash({
					blockHash: landedLogs[0].blockHash,
					round: tableRound || BigInt(0),
				});
				round &&
					updateState({
						state: 'landing',
						result: Number(landedLogs[0].args.value),
						tableRound: round.roundAllBets,
						tablePlayerRound: round.roundPlayerBets || undefined,
					});
				queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
			}
		},
	});
	return (
		<div className="">
			<LiveRoulette />
		</div>
	);
}
