import { useGetCurrentRound, useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useRouletteState } from '@/src/lib/roulette/query';
import { getRequiredAllowance } from '@/src/lib/shared/api';
import { useGetTableAddress, useLocalBets, useSubmitBet } from '@/src/lib/shared/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useToast } from '@betfinio/components/hooks';
import { Button } from '@betfinio/components/ui';
import { useAllowanceModal } from 'betfinio_context/lib/context';
import { useAllowance, useIsMember } from 'betfinio_context/lib/query';
import { Loader } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const SubmitBet: FC = () => {
	const { t } = useTranslation('roulette');
	const { toast } = useToast();

	const { isSingle, tableAddress } = useGetTableAddress();
	const { data: currentRound } = useGetCurrentRound(tableAddress || ZeroAddress);

	const { address = ZeroAddress } = useAccount();
	const { data: isMember = false } = useIsMember(address);
	const { requestAllowance } = useAllowanceModal();
	const { mutate: submitBet, isPending } = useSubmitBet();
	const { data: allowance = 0n, isFetching: loading } = useAllowance(address);
	const { state: rouletteWheelStateData } = useRouletteState();
	const { state: liveRouletteWheelStateData } = useLiveRouletteState();
	const rouletteWheelState = rouletteWheelStateData.data;
	const liveRouletteWheelState = liveRouletteWheelStateData.data;
	const { data: bets = [] } = useLocalBets();

	const isSpinning =
		loading || isPending || (isSingle && rouletteWheelState.state === 'spinning') || (!isSingle && liveRouletteWheelState.state === WheelStatus.Requested);

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

		if (isSingle && rouletteWheelState.state === 'spinning') return;
		if (!isSingle && liveRouletteWheelState.state === WheelStatus.Requested) return;

		if (valueToNumber(allowance) < Number(getRequiredAllowance())) {
			toast({
				description: t('pleaseIncreaseAllowance'),
				variant: 'destructive',
			});
			requestAllowance?.('bet', BigInt(getRequiredAllowance()) * 10n ** 18n);
			return;
		}

		submitBet({
			bets,
			roundNumber: currentRound?.round || 0n,
			tableAddress: isSingle ? ZeroAddress : tableAddress || ZeroAddress,
			playerAddress: address,
		});
	};

	return (
		<>
			<Button className="w-full uppercase text-xl px-8 relative" onClick={handleSpin} disabled={isSpinning || address === undefined}>
				{isSpinning && <Loader color={'black'} className={'animate-spin absolute'} />}
				<span className={cn('uppercase', { invisible: isSpinning })}>{isSingle ? t('spin') : t('submitBet')}</span>
			</Button>
		</>
	);
};
