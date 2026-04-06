import { useMediaQuery } from '@betfinio/components/hooks';
import { toast } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { type Address, zeroAddress } from 'viem';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { SINGLE_PLAYER_GAME } from '@/src/global';
import { HouseGameABI } from '@/src/lib/abi';
import { useGetPlayerBets, useRouletteState } from '@/src/lib/roulette/query';
import type { PlayerBet } from '@/src/lib/roulette/types';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { useScrollToHeader, useVisibleTable } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { RouletteResultToast } from '../RouletteResultToast';
import { DesktopRoulette } from './DesktopRoulette';
import { TabletRoulette } from './TabletRoulette';
import { VerticalRoulette } from './VerticalRoulette';

export const Roulette = () => {
	const queryClient = useQueryClient();
	const { isTablet, isVertical } = useMediaQuery();
	const { table } = useVisibleTable();
	const { scrollToHeader } = useScrollToHeader();
	const { address = zeroAddress } = useAccount();

	const { data: bets = [] } = useGetPlayerBets(table);

	const { state: wheelStateData, updateState } = useRouletteState();
	const status = wheelStateData.data.state;

	/**
	 * Single-player: BetPlaced → wheel starts spinning
	 */
	useWatchContractEvent({
		abi: HouseGameABI,
		address: SINGLE_PLAYER_GAME,
		eventName: 'BetPlaced',
		args: { player: address as Address },
		onLogs: () => {
			updateState({ state: 'spinning' });
		},
	});

	/**
	 * Single-player: BetResolved → win number arrives, start landing animation
	 */
	useWatchContractEvent({
		abi: HouseGameABI,
		address: SINGLE_PLAYER_GAME,
		eventName: 'BetResolved',
		args: { player: address as Address },
		onLogs: (logs) => {
			const log = logs[0];
			if (!log) return;
			const winNumber = Number(log.args.result ?? 0n);
			const payout = log.args.payout ?? 0n;
			const betAddress = (log.args.bet ?? zeroAddress) as Address;
			const amount = log.args.amount ?? 0n;

			const bet: PlayerBet = {
				bet: betAddress,
				player: address,
				amount,
				winNumber,
				winAmount: payout,
				created: BigInt(Math.floor(Date.now() / 1000)),
				status: RoundStatus.FINISHED,
			};

			updateState({ state: 'landing', result: winNumber, bet });

			// Defer refetch so subgraph can index; immediate refetch can overwrite Wheel.tsx optimistic `setQueryData` with stale rows.
			setTimeout(() => {
				void queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'player', address] });
				void queryClient.invalidateQueries({ queryKey: ['roulette', 'bets', 'player', 'all'] });
				void queryClient.invalidateQueries({ queryKey: ['roulette', 'bet', 'stat', address] });
			}, 5000);
		},
	});

	const lastShownBet = useRef<Address>(undefined);
	const lastStatus = useRef<typeof status>(undefined);
	useEffect(() => {
		const latest = bets[0];
		if (status === 'landed' && latest && latest.bet.toLowerCase() !== lastShownBet.current?.toLowerCase()) {
			toast(<RouletteResultToast rouletteBet={latest} />, { classNames: { content: '!w-full' } });

			const hasWon = latest.amount < latest.winAmount;
			if (hasWon) shootConfetti();
			lastShownBet.current = latest.bet;
			lastStatus.current = status;
		}

		if (status === 'spinning' && lastStatus.current !== 'spinning') {
			scrollToHeader();
			lastStatus.current = status;
		}
	}, [bets, status, scrollToHeader]);

	useEffect(() => {
		if (!lastShownBet.current && bets[0]) {
			lastShownBet.current = bets[0].bet;
		}
	}, [bets]);

	if (isVertical) {
		return (
			<div className="relative w-full flex flex-col items-center justify-center p-2 gap-y-2">
				<VerticalRoulette />
			</div>
		);
	}

	if (isTablet) {
		return (
			<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
				<TabletRoulette />
			</div>
		);
	}

	return (
		<div className="relative w-full flex flex-col items-center justify-center gap-y-2">
			<DesktopRoulette />
		</div>
	);
};
