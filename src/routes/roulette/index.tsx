import { Roulette } from '@/src/components/roulette/Roulette';
import { PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { useGetTableAddress, useRouletteState } from '@/src/lib/roulette/query';
import { LiveRouletteABI, ZeroAddress } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { parseAbiItem } from 'viem';
import { getLogs } from 'viem/actions';
import { useAccount, useConfig, useWatchContractEvent } from 'wagmi';

export const Route = createFileRoute('/roulette/')({
	component: RoulettePage,
});

function RoulettePage() {
	const { updateState } = useRouletteState();

	const { address = ZeroAddress } = useAccount();
	const queryClient = useQueryClient();
	const config = useConfig();
	const { tableAddress } = useGetTableAddress();

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		onLogs: async (rolledLogs) => {
			const eventOfThePlayer = rolledLogs[0].args.player?.toString().toLowerCase() === address.toLowerCase();
			if (eventOfThePlayer) {
				updateState({ state: 'spinning' });
			}
		},
	});

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		onLogs: async (landedLogs) => {
			const eventOfThePlayer = landedLogs[0].args.player?.toString().toLowerCase() === address.toLowerCase();
			const logs = await getLogs(config.getClient(), {
				address: tableAddress,
				event: parseAbiItem('event BetEnded(address indexed bet, uint256 indexed round, uint256 value, uint256 winAmount)'),
				args: {
					round: BigInt(0),
				},
				blockHash: landedLogs[0].blockHash,
			});
			console.log(logs);
			if (eventOfThePlayer) {
				updateState({
					state: 'landing',
					result: Number(landedLogs[0].args.value),
					bet: logs[0].args.bet || ZeroAddress,
				});
				await queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
			}
		},
	});

	return (
		<div className="">
			<Roulette />
		</div>
	);
}
