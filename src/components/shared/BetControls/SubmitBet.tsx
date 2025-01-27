import { useCurrentRound, useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useRouletteState } from '@/src/lib/roulette/query';
import { getRequiredAllowance } from '@/src/lib/shared/api';
import { useLocalBets, useSubmitBet, useVisibleTable } from '@/src/lib/shared/query';
import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { useToast } from '@betfinio/components/hooks';
import { BetValue } from '@betfinio/components/shared';
import { Button } from '@betfinio/components/ui';
import { useAllowanceModal } from 'betfinio_context/lib/context';
import { useAllowance, useIsMember } from 'betfinio_context/lib/query';
import * as _ from 'lodash';
import { Loader } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const SubmitBet: FC = () => {
	const { t } = useTranslation('roulette');
	const { toast } = useToast();

	const { isSingle, table } = useVisibleTable();
	const { data: currentRound = 0 } = useCurrentRound(table);

	const { address = ZeroAddress } = useAccount();
	const { data: isMember = false } = useIsMember(address);
	const { requestAllowance, setResult, requested } = useAllowanceModal();
	const { mutate: submitBet, isPending, isSuccess, data } = useSubmitBet();
	const { data: allowance = 0n } = useAllowance(address);
	const { state: rouletteWheelStateData } = useRouletteState();
	const { state: liveRouletteWheelStateData } = useLiveRouletteState();
	const rouletteWheelState = rouletteWheelStateData.data;
	const liveRouletteWheelState = liveRouletteWheelStateData.data;
	const { data: bets = [] } = useLocalBets();
	const isSpinning =
		isPending || (isSingle && rouletteWheelState.state === 'spinning') || (!isSingle && liveRouletteWheelState.state === WheelStatus.Requested);

	useEffect(() => {
		console.log('bets', bets);
	}, [bets]);

	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);

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
			bets: _.cloneDeep(bets),
			roundNumber: isSingle ? 0n : BigInt(currentRound),
			table: isSingle ? ZeroAddress : table || ZeroAddress,
			playerAddress: address,
		});
	};
	useEffect(() => {
		if (data && isSuccess) {
			setResult?.(data);
		}
	}, [isSuccess, data]);
	useEffect(() => {
		if (requested) {
			handleSpin();
		}
	}, [requested]);

	return (
		<>
			<Button className="w-full uppercase text-xl px-4 relative" onClick={handleSpin} disabled={isSpinning || address === undefined}>
				{isSpinning && <Loader color={'black'} className={'animate-spin absolute'} />}
				<div className={cn('uppercase', { invisible: isSpinning })}>
					<div className="flex gap-2 w-32 justify-center text-base">
						{t('submitBet')}
						<BetValue iconClassName="rounded-full border border-border" withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
					</div>
				</div>
			</Button>
		</>
	);
};
