import { toast } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { type Address, decodeAbiParameters, parseAbiParameters, zeroAddress } from 'viem';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { RouletteResultToast } from '@/src/components/RouletteResultToast';
import { MULTIPLAYER_GAME } from '@/src/global.ts';
import { HouseMultiplayerGameABI } from '@/src/lib/abi';
import { cacheVrfWinNumberForRound, vrfWordToRouletteWinNumber } from '@/src/lib/live-roulette/api';
import { LIVE_ROULETTE_WIN_UNKNOWN } from '@/src/lib/live-roulette/gql';
import {
	useGetTableRoundPlayers,
	useGetTableSelectedRoundBets,
	useLiveRouletteState,
	useLiveRouletteTableStats,
	useTablePlayerRounds,
	useTableRounds,
} from '@/src/lib/live-roulette/query';
import {
	type PlayerInProgressBet,
	type PlayerRoundBets,
	type RoundBet,
	type RoundPlayerBet,
	type WheelState,
	WheelStatus,
} from '@/src/lib/live-roulette/types.ts';
import { shootConfetti } from '@/src/lib/roulette/utils';
import { decodeBet } from '@/src/lib/shared';
import { clearAllBets } from '@/src/lib/shared/api';
import { useScrollToHeader, useVisibleRound, useVisibleTable } from '@/src/lib/shared/query';
import { type LocalBet, RoundStatus } from '@/src/lib/shared/types.ts';

function Watchers() {
	const queryClient = useQueryClient();
	const { address = zeroAddress } = useAccount();
	const { scrollToHeader } = useScrollToHeader();
	const { updateState, updateRoundState } = useLiveRouletteState();

	const { table } = useVisibleTable();
	const { round: visibleRound } = useVisibleRound();
	const addressLower = address.toLowerCase();

	const { data: rounds = [], queryKey: tableRoundsQueryKey } = useTableRounds(table);
	const { data: playerRounds = [], queryKey: playerRoundsQueryKey } = useTablePlayerRounds(table);

	const { data: tableSelectedRoundBets, queryKey: tableSelectedRoundBetsQueryKey } = useGetTableSelectedRoundBets(table, visibleRound);
	const { data: tableRoundPlayers = [], queryKey: tableRoundPlayersQueryKey } = useGetTableRoundPlayers(table, visibleRound);

	const { queryKey: tableStatQueryKey } = useLiveRouletteTableStats(table);
	const tableStatTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	/**
	 * Watcher for RandomnessRequested — round is now spinning (awaiting VRF)
	 */
	useWatchContractEvent({
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		eventName: 'RandomnessRequested',
		onLogs: (logs) => {
			for (const log of logs) {
				// contextId for HouseMultiplayerGame is the roundId
				const roundId = log.args.contextId;
				if (roundId !== undefined) {
					const id = Number(roundId);
					updateRoundState(id, { state: WheelStatus.Requested });
					if (id === visibleRound) scrollToHeader();
				}
			}
		},
	});

	/**
	 * RandomnessFulfilled — VRF delivered; winning pocket is known (`randomWord % 37`).
	 * Drives wheel landing animation here. `BetResolved` only fires after `settleRound` (payouts).
	 */
	useWatchContractEvent({
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		eventName: 'RandomnessFulfilled',
		onLogs: async (logs) => {
			const gameAddr = (table ?? MULTIPLAYER_GAME) as Address;
			for (const log of logs) {
				const roundId = log.args.contextId;
				const randomWord = log.args.randomWord;
				if (roundId === undefined || randomWord === undefined) continue;
				const roundIdNum = Number(roundId);
				const winNumber = vrfWordToRouletteWinNumber(randomWord);
				cacheVrfWinNumberForRound(queryClient, gameAddr, roundIdNum, randomWord);
				void queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'status', gameAddr, roundIdNum] });
				void queryClient.invalidateQueries({ queryKey: ['roulette', 'round', 'winNumber', gameAddr, roundIdNum] });

				const isVisibleRound = roundIdNum === visibleRound;
				if (isVisibleRound) {
					updateState({
						state: WheelStatus.Landing,
						result: winNumber,
					});
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
				} else {
					updateRoundState(roundIdNum, {
						state: WheelStatus.ResultReadyAwaitingSettlement,
						result: winNumber,
					});
				}
			}
		},
	});

	/**
	 * Watcher for BetResolved — win number is now known for a round.
	 * Each bet in the round fires this event with the same result.
	 * We deduplicate by roundId so we only trigger the animation once per round.
	 */
	useWatchContractEvent({
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		eventName: 'BetResolved',
		onLogs: async (resolvedLogs) => {
			const mySettlementLogs = resolvedLogs.filter((log) => {
				const r = Number(log.args.roundId ?? 0n);
				const p = (log.args.player ?? zeroAddress) as Address;
				return r === visibleRound && p.toLowerCase() === addressLower;
			});
			if (mySettlementLogs.length > 0) {
				const amount = mySettlementLogs.reduce((s, l) => s + (l.args.amount ?? 0n), 0n);
				const winAmount = mySettlementLogs.reduce((s, l) => s + (l.args.payout ?? 0n), 0n);
				const winNumber = Number(mySettlementLogs[0].args.result ?? 0n);
				toast(<RouletteResultToast rouletteBet={{ amount, winAmount, winNumber }} />, { classNames: { content: '!w-full' } });
				if (winAmount > 0n) shootConfetti();
			}

			// Deduplicate: only process first BetResolved per round (all share same win number)
			const processedRounds = new Set<number>();

			const handleResolvedEvent = async (log: (typeof resolvedLogs)[0]) => {
				const eventRound = Number(log.args.roundId ?? 0n);
				const winNumber = Number(log.args.result ?? 0n);
				const payout = log.args.payout ?? 0n;
				const betAddress = log.args.bet as Address;

				const isVisibleRound = eventRound === visibleRound;
				const wheelKey = ['live-roulette', 'state', eventRound, table] as const;
				const priorWheel = queryClient.getQueryData<WheelState>(wheelKey) ?? { state: WheelStatus.Loading };
				const stillSpinning = priorWheel.state === WheelStatus.Requested;

				// Defer stat refresh to avoid hammering the subgraph immediately
				if (tableStatTimeoutRef.current) clearTimeout(tableStatTimeoutRef.current);
				tableStatTimeoutRef.current = setTimeout(() => {
					queryClient.refetchQueries({ queryKey: tableStatQueryKey });
				}, 5000);

				// Optimistically update payout for this bet in the selected-round panel
				const updatedTableSelectedRoundBets = tableSelectedRoundBets
					? tableSelectedRoundBets.map((bet: PlayerInProgressBet) => (bet.bet.toLowerCase() === betAddress.toLowerCase() ? { ...bet, winAmount: payout } : bet))
					: [];

				if (isVisibleRound) {
					if (stillSpinning) {
						updateState({
							...priorWheel,
							state: WheelStatus.Landing,
							result: winNumber,
							tableSelectedRoundBets: updatedTableSelectedRoundBets,
						});
					} else {
						updateState({
							...priorWheel,
							tableSelectedRoundBets: updatedTableSelectedRoundBets,
						});
					}
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
				} else {
					if (stillSpinning) {
						updateRoundState(eventRound, {
							...priorWheel,
							state: WheelStatus.JustFinished,
							result: winNumber,
							tableSelectedRoundBets: updatedTableSelectedRoundBets,
						});
					} else {
						updateRoundState(eventRound, {
							...priorWheel,
							tableSelectedRoundBets: updatedTableSelectedRoundBets,
						});
					}
					queryClient.refetchQueries({ queryKey: ['roulette', 'round', 'status', table, eventRound] });
					queryClient.refetchQueries({ queryKey: ['roulette', 'round', 'winNumber', table, eventRound] });
				}
			};

			for (const log of resolvedLogs) {
				const roundId = Number(log.args.roundId ?? 0n);
				if (!processedRounds.has(roundId)) {
					processedRounds.add(roundId);
					await handleResolvedEvent(log);
				}
			}
		},
	});

	/**
	 * Watcher for BetPlaced — a new bet was submitted.
	 * Chips are decoded directly from event.data (no eth_calls needed).
	 */
	useWatchContractEvent({
		abi: HouseMultiplayerGameABI,
		address: MULTIPLAYER_GAME,
		eventName: 'BetPlaced',
		onLogs: async (logs) => {
			const handleBetPlacedEvent = async (log: (typeof logs)[0]) => {
				const eventRound = Number(log.args.roundId ?? 0n);
				const betAddress = (log.args.bet ?? zeroAddress) as Address;
				const player = (log.args.player ?? zeroAddress) as Address;
				const amount = log.args.amount ?? 0n;
				const created = BigInt(Math.floor(Date.now() / 1000));

				// Decode chips from event data inline — no RPC call needed
				let chips: { bitMap: number }[] = [];
				let localBetsFromEvent: LocalBet[] = [];
				try {
					// BetPlaced.data = IBet(bet).data() which is set by validateBet as abi.encode(recipient, SubBet[])
					// Must decode as (address, SubBet[]) to skip the leading recipient address
					const [, subBets] = decodeAbiParameters(parseAbiParameters(['address', '(uint256 amount, uint256 bitmap)[]']), log.args.data as `0x${string}`);
					chips = subBets.map((s) => ({ bitMap: Number(s.bitmap) }));
					localBetsFromEvent = subBets.map((s) => ({ amount: s.amount, bitmap: s.bitmap, player })).map(decodeBet);
				} catch {
					// data decode failed; chips will be empty and overlay won't update optimistically
				}

				await queryClient.invalidateQueries({ queryKey: ['roulette', 'bank'] });

				const roundBet: RoundBet = {
					amount,
					winAmount: 0n,
					created,
					round: eventRound,
					winNumber: LIVE_ROULETTE_WIN_UNKNOWN,
					status: RoundStatus.CREATED,
				};

				// Merge against TanStack cache so we never overwrite subgraph history with stale hook state
				const priorRounds = queryClient.getQueryData<RoundBet[]>(tableRoundsQueryKey) ?? rounds;
				const updatedRounds: RoundBet[] = priorRounds.some((r: RoundBet) => r.round === roundBet.round)
					? priorRounds.map((r: RoundBet) => (r.round === roundBet.round ? { ...r, amount: r.amount + amount } : r))
					: [roundBet, ...priorRounds];
				queryClient.setQueryData(tableRoundsQueryKey, updatedRounds);

				const roundPlayerBet: RoundPlayerBet = { ...roundBet, player };

				if (player.toLowerCase() === address.toLowerCase()) {
					const priorPlayerRounds = queryClient.getQueryData<RoundPlayerBet[]>(playerRoundsQueryKey) ?? playerRounds;
					const updatedPlayerRound: RoundPlayerBet[] = priorPlayerRounds.some((r: RoundPlayerBet) => r.round === roundPlayerBet.round)
						? priorPlayerRounds.map((r: RoundPlayerBet) => (r.round === roundPlayerBet.round ? { ...r, amount: r.amount + amount } : r))
						: [roundPlayerBet, ...priorPlayerRounds];
					queryClient.setQueryData(playerRoundsQueryKey, updatedPlayerRound);
				}

				const playerInProgressBet: PlayerInProgressBet = {
					amount,
					created,
					winAmount: 0n,
					bet: betAddress,
					player,
					chips,
				};

				// Only update the per-round bet panel, players panel, and board overlay when
				// this bet belongs to the currently viewed round — prevents cross-round contamination.
				if (eventRound === visibleRound) {
					const priorSelected = queryClient.getQueryData<PlayerInProgressBet[]>(tableSelectedRoundBetsQueryKey) ?? tableSelectedRoundBets ?? [];
					const updatedTableSelectedRoundBets: PlayerInProgressBet[] = [...priorSelected, playerInProgressBet];
					queryClient.setQueryData(tableSelectedRoundBetsQueryKey, updatedTableSelectedRoundBets);

					const priorPlayers = queryClient.getQueryData<PlayerRoundBets[]>(tableRoundPlayersQueryKey) ?? tableRoundPlayers;
					const updatedTableRoundPlayers: PlayerRoundBets[] = priorPlayers.some((p: PlayerRoundBets) => p.player.toLowerCase() === player.toLowerCase())
						? priorPlayers.map((p: PlayerRoundBets) =>
								p.player.toLowerCase() === player.toLowerCase() ? { ...p, amount: p.amount + amount, betCounts: p.betCounts + 1 } : p,
							)
						: [...priorPlayers, { player, amount, betCounts: 1, created }];
					queryClient.setQueryData(tableRoundPlayersQueryKey, updatedTableRoundPlayers);

					// Update roulette board overlay with decoded chip positions
					const allBets = queryClient.getQueryData<LocalBet[]>(['roulette', 'bets', 'all', table, eventRound]) || [];
					queryClient.setQueryData(['roulette', 'bets', 'all', table, eventRound], [...allBets, ...localBetsFromEvent]);
				}

				if (player.toLowerCase() === address.toLowerCase()) {
					await clearAllBets(false);
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] });
				}
			};

			await Promise.all(logs.map(handleBetPlacedEvent));
		},
	});

	return null;
}

export default Watchers;
