import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import { PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { fetchTableByAddress } from '@/src/lib/roulette/api';
import { useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import { LiveRouletteABI, ZeroAddress } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { type Address, isAddress } from 'viem';
import { useWatchContractEvent } from 'wagmi';

export const Route = createFileRoute('/roulette/live/$table')({
	component: RouletteLiveTable,
	loader: async ({ params, context }) => {
		const isValidAddress = isAddress(params.table);
		if (!isValidAddress) {
			throw redirect({ to: '/roulette' });
		}
		const isTableExist = await fetchTableByAddress(context.wagmiConfig, params.table as Address);
		if (!isTableExist) {
			throw redirect({ to: '/roulette' });
		}
	},
	onError: (e) => {
		throw redirect({ to: '/roulette' });
	},
});

function RouletteLiveTable() {
	const queryClient = useQueryClient();
	const { updateState } = useRouletteState();

	const { tableAddress } = useGetTableAddress();

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

			if (eventOfTheTable) {
				updateState({
					state: 'landing',
					result: Number(landedLogs[0].args.value),
					bet: ZeroAddress,
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
