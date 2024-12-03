import { getRequiredAllowance } from '@/src/lib/roulette/api';
import { useLocalBets, useRouletteState, useSpin } from '@/src/lib/roulette/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useToast } from '@betfinio/components/hooks';
import { Button } from '@betfinio/components/ui';
import { useAllowanceModal } from 'betfinio_app/allowance';
import { useIsMember } from 'betfinio_app/lib/query/pass';
import { useAllowance } from 'betfinio_app/lib/query/token';
import { Loader } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const Spin: FC = () => {
	const { t } = useTranslation('roulette');
	const { toast } = useToast();
	const { address = ZeroAddress } = useAccount();
	const { data: isMember = false } = useIsMember(address);
	const { requestAllowance } = useAllowanceModal();
	const { mutate: spin, isPending } = useSpin();
	const { data: allowance = 0n, isFetching: loading } = useAllowance(address);
	const { state: wheelStateData } = useRouletteState();
	const wheelState = wheelStateData.data;
	const { data: bets = [] } = useLocalBets();

	const isSpinning = loading || isPending;

	const handleSpin = () => {
		if (address === ZeroAddress) {
			toast({
				description: t('pleaseConnectYourWallet'),
				variant: 'destructive',
			});
			return;
		}
		if (!isMember) {
			toast({
				description: t('connectedWalletIsNotMember'),
				variant: 'destructive',
			});
			return;
		}

		if (wheelState.state === 'spinning') return;

		if (valueToNumber(allowance) < Number(getRequiredAllowance())) {
			toast({
				description: t('pleaseIncreaseAllowance'),
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
			<span className={cn('uppercase', { invisible: isSpinning })}>{t('spin')}</span>
		</Button>
	);
};
