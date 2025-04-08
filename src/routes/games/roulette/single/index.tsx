import { VersionValidation } from '@/src/components/VersionValidation';
import { Roulette } from '@/src/components/roulette/Roulette';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED, PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { useFetchTableBetByBlockHash, useRouletteState } from '@/src/lib/roulette/query';
import { LiveRouletteABI, ZeroAddress } from '@betfinio/abi';
import { SonnerToaster } from '@betfinio/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useAccount, useWatchContractEvent } from 'wagmi';

export const Route = createFileRoute('/games/roulette/single/')({
	component: RoulettePage,
});

export function RoulettePage() {
	const { updateState } = useRouletteState();

	const { address = ZeroAddress } = useAccount();
	const { mutateAsync: fetchTableBetByBlockHash } = useFetchTableBetByBlockHash();
	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		onLogs: async (rolledLogs) => {
			const eventOfThePlayer = rolledLogs[0].args.player?.toString().toLowerCase() === address.toLowerCase() && address !== ZeroAddress;
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

			if (eventOfThePlayer) {
				const bet = await fetchTableBetByBlockHash(landedLogs[0].blockHash);
				bet &&
					updateState({
						state: 'landing',
						result: Number(landedLogs[0].args.value),
						bet,
					});
			}
		},
	});

	return (
		<div className="roulette">
			<Roulette />
			<SonnerToaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</div>
	);
}
