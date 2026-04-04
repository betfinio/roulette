import { valueToNumber, ZeroAddress } from '@betfinio/abi';
import { cn } from '@betfinio/components';
import { BetValue } from '@betfinio/components/shared';
import { Button, toast } from '@betfinio/components/ui';
import { useAllowanceModal } from 'betfinio_context/lib/context';
import { useAllowance, useIsMember } from 'betfinio_context/lib/query';
import * as _ from 'lodash';
import { Loader } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { CORE_ADDRESS, MULTIPLAYER_INTERVAL } from '@/src/global';
import { fetchCurrentRound } from '@/src/lib/live-roulette/api';
import { useLiveRouletteState } from '@/src/lib/live-roulette/query';
import { WheelStatus } from '@/src/lib/live-roulette/types';
import { useRouletteState } from '@/src/lib/roulette/query';
import { getRequiredAllowance } from '@/src/lib/shared/api';
import { useLocalBets, useSubmitBet, useVisibleTable } from '@/src/lib/shared/query';

export const SubmitBet: FC = () => {
	const { t } = useTranslation('roulette');

	const { isSingle, table } = useVisibleTable();

	const { address = ZeroAddress } = useAccount();
	const { data: isMember = false } = useIsMember(address);
	const { requestAllowance, setResult } = useAllowanceModal();
	const { mutate: submitBet, mutateAsync: submitBetAsync, isPending, isSuccess, data } = useSubmitBet();
	const { data: allowance = 0n } = useAllowance(address, CORE_ADDRESS);
	const { state: rouletteWheelStateData } = useRouletteState();
	const { state: liveRouletteWheelStateData } = useLiveRouletteState();
	const rouletteWheelState = rouletteWheelStateData.data;
	const liveRouletteWheelState = liveRouletteWheelStateData.data;
	const { data: bets = [] } = useLocalBets();
	const liveViewingSettlingRound =
		!isSingle && (liveRouletteWheelState.state === WheelStatus.Requested || liveRouletteWheelState.state === WheelStatus.ResultReadyAwaitingSettlement);
	const isSpinning = isPending || (isSingle && rouletteWheelState.state === 'spinning') || (!isSingle && liveViewingSettlingRound);

	const totalBet = bets.reduce((acc, bet) => acc + bet.amount, 0);

	const handleSpin = () => {
		if (address === ZeroAddress) {
			toast.error(t('pleaseConnectYourWallet'));
			return;
		}
		if (!isMember) {
			toast.error(t('connectedWalletIsNotMember'));
			return;
		}

		if (isSingle && rouletteWheelState.state === 'spinning') return;
		if (!isSingle && liveViewingSettlingRound) return;

		const betParams = {
			bets: _.cloneDeep(bets),
			gameAddress: table || ZeroAddress,
			playerAddress: address,
			multiplayerRoundId: isSingle ? undefined : BigInt(fetchCurrentRound(MULTIPLAYER_INTERVAL)),
		};

		if (valueToNumber(allowance) < Number(getRequiredAllowance())) {
			requestAllowance?.({
				type: 'bet',
				amount: BigInt(getRequiredAllowance()) * 10n ** 18n,
				spender: CORE_ADDRESS,
				execute: () => submitBetAsync(betParams),
			});
			return;
		}
		submitBet(betParams);
	};
	useEffect(() => {
		if (data && isSuccess) {
			setResult?.(data);
		}
	}, [isSuccess, data, setResult]);

	return (
		<Button className="w-full uppercase text-xl px-4 relative" onClick={handleSpin} disabled={isSpinning || address === undefined}>
			{isSpinning && <Loader color={'black'} className={'animate-spin absolute'} />}
			<div className={cn('uppercase', { invisible: isSpinning })}>
				<div className="flex gap-2 w-32 justify-center text-base">
					{t('submitBet')}
					<BetValue iconClassName="rounded-full border border-border" withIcon value={valueToNumber(BigInt(totalBet) * 10n ** 18n)} />
				</div>
			</div>
		</Button>
	);
};
