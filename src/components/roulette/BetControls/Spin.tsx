import { getRequiredAllowance } from '@/src/lib/roulette/api';
import { useLocalBets, useRouletteState, useSpin } from '@/src/lib/roulette/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { useAllowanceModal } from 'betfinio_app/allowance';
import { Button } from 'betfinio_app/button';
import { useIsMember } from 'betfinio_app/lib/query/pass';
import { useAllowance } from 'betfinio_app/lib/query/token';
import { cn } from 'betfinio_app/lib/utils';
import { useToast } from 'betfinio_app/use-toast';
import { Loader } from 'lucide-react';
import type { FC } from 'react';
import { useAccount } from 'wagmi';

export const Spin: FC = () => {
	const { toast } = useToast();
	const { address = ZeroAddress } = useAccount();
	const { data: isMember = false } = useIsMember(address);
	const { requestAllowance, setResult, requested } = useAllowanceModal();
	const { mutate: spin, data, isPending, isSuccess } = useSpin();
	const { data: allowance = 0n, isFetching: loading } = useAllowance(address);
	const { state: wheelStateData } = useRouletteState();
	const wheelState = wheelStateData.data;
	const { data: bets = [] } = useLocalBets();

	const isSpinning = loading || isPending;

	const handleSpin = () => {
		if (address === ZeroAddress) {
			toast({
				description: 'Please connect your wallet',
				variant: 'destructive',
			});
			return;
		}
		if (!isMember) {
			toast({
				description: 'Connected wallet is not member of Betfin. Ask someone for an invitation',
				variant: 'destructive',
			});
			return;
		}

		if (wheelState.state === 'spinning') return;

		if (valueToNumber(allowance) < Number(getRequiredAllowance())) {
			toast({
				description: 'Please increase your allowance',
				variant: 'destructive',
			});
			requestAllowance?.('bet', BigInt(getRequiredAllowance()) * 10n ** 18n);
			return;
		}

		spin({ bets });
	};

	return (
		<Button
			className="w-full uppercase text-xl px-8 relative"
			onClick={handleSpin}
			disabled={wheelState.state === 'spinning' || isSpinning || address === undefined || isPending}
		>
			{isSpinning && <Loader color={'black'} className={'animate-spin absolute'} />}
			<span className={cn({ invisible: isSpinning })}>{'SPIN'}</span>
		</Button>
	);
};
