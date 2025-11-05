import { LiveRouletteABI, MultiPlayerTableABI, ZeroAddress } from '@betfinio/abi';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useAccount, useConfig, useWatchContractEvent } from 'wagmi';
import { PUBLIC_LIRO_ADDRESS } from '@/src/global.ts';
import {
	useFetchTableBetsByBlockHash,
	useGetTableRoundPlayers,
	useGetTableSelectedRoundBets,
	useLiveRouletteState,
	useLiveRouletteTableStats,
	useTablePlayerRounds,
	useTableRounds,
} from '@/src/lib/live-roulette/query';
import { type PlayerInProgressBet, type PlayerRoundBets, type RoundBet, type RoundPlayerBet, WheelStatus } from '@/src/lib/live-roulette/types.ts';
import { clearAllBets, fetchBetBitmaps, fetchBetInfo } from '@/src/lib/shared/api';
import { useVisibleRound, useVisibleTable } from '@/src/lib/shared/query';
import { type LocalBet, RoundStatus } from '@/src/lib/shared/types.ts';

function Watchers() {
	const queryClient = useQueryClient();
	const { address = ZeroAddress } = useAccount();
	const { updateState, updateRoundState } = useLiveRouletteState();

	const { table } = useVisibleTable();
	const { round: visibleRound } = useVisibleRound();

	const { mutateAsync: fetchTableBetsByBlockHash } = useFetchTableBetsByBlockHash();

	const { data: rounds = [], queryKey: tableRoundsQueryKey } = useTableRounds(table);
	const { data: playerRounds = [], queryKey: playerRoundsQueryKey } = useTablePlayerRounds(table);
	const config = useConfig();

	const { data: tableSelectedRoundBets, queryKey: tableSelectedRoundBetsQueryKey } = useGetTableSelectedRoundBets(table, visibleRound);
	const { data: tableRoundPlayers = [], queryKey: tableRoundPlayersQueryKey } = useGetTableRoundPlayers(table, visibleRound);

	const { queryKey: tableStatQueryKey } = useLiveRouletteTableStats(table);
	const tableStatTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	/**
	 * Watcher for the Requested event
	 */
	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		args: {
			table: table,
		},
		onLogs: async (requestedLogs) => {
			const requestedRound = requestedLogs[0].args.round;
			updateRoundState(Number(requestedRound), { state: WheelStatus.Requested });
			// await queryClient.invalidateQueries({ queryKey: ['roulette'] });
		},
	});

	/**
	 * Watcher for the RandomGenerated event
	 */
	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		args: {
			table,
		},
		onLogs: async (landedLogs) => {
			const handleLandedEvent = async (landedLog: (typeof landedLogs)[0]) => {
				const eventRound = landedLog.args.round;

				const isVisibleRound = eventRound === BigInt(visibleRound);

				// Update Stat
				if (tableStatTimeoutRef.current) {
					clearTimeout(tableStatTimeoutRef.current);
				}
				tableStatTimeoutRef.current = setTimeout(() => {
					queryClient.refetchQueries({ queryKey: tableStatQueryKey });
				}, 5000);

				// check if the event is for the visible table and round
				if (isVisibleRound) {
					const roundInfo = await fetchTableBetsByBlockHash({
						blockHash: landedLog.blockHash,
						round: eventRound,
					});
					if (!roundInfo) return;
					const { roundAllBets, roundPlayerBets, roundPlayersDetailedBets } = roundInfo;
					let updatedTableSelectedRoundBets = tableSelectedRoundBets;
					if (roundPlayersDetailedBets && tableSelectedRoundBets) {
						updatedTableSelectedRoundBets = tableSelectedRoundBets.map((bet) => {
							const blockChainResult = roundPlayersDetailedBets.find((result) => result.bet.toLowerCase() === bet.bet.toLowerCase());
							if (blockChainResult) {
								return { ...bet, ...blockChainResult, chips: bet.chips };
							}
							return bet;
						});
					}
					updateState({
						state: WheelStatus.Landing,
						result: Number(landedLog.args.value),
						tableRound: roundAllBets,
						tablePlayerRound: roundPlayerBets || undefined,
						tableSelectedRoundBets: updatedTableSelectedRoundBets || [],
					});
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
				}
				// check if the event is for the visible table but not the visible round
				if (!isVisibleRound) {
					const roundInfo = await fetchTableBetsByBlockHash({
						blockHash: landedLog.blockHash,
						round: eventRound ?? 0n,
					});

					if (!roundInfo) return;
					const { roundAllBets, roundPlayerBets } = roundInfo;

					// Populate all bets for the current round

					if (roundAllBets) {
						const updatedRounds = rounds.map((round) => (round.round === roundAllBets.round ? roundAllBets : round));
						queryClient.setQueryData(tableRoundsQueryKey, updatedRounds, {
							updatedAt: Date.now(),
						});
					}
					// Populate all bets for the current round for the player
					if (roundPlayerBets) {
						const updatedPlayerRounds = playerRounds.map((round) => (round.round === roundPlayerBets.round ? roundPlayerBets : round));
						queryClient.setQueryData(playerRoundsQueryKey, updatedPlayerRounds, {
							updatedAt: Date.now(),
						});
					}
					updateRoundState(Number(eventRound), {
						state: WheelStatus.JustFinished,
						result: Number(landedLog.args.value),
						tableRound: roundAllBets,
						tablePlayerRound: roundPlayerBets || undefined,
						tableSelectedRoundBets: tableSelectedRoundBets || [],
					});

					queryClient.refetchQueries({ queryKey: ['roulette', 'round', 'status', table, Number(eventRound)] });
					queryClient.refetchQueries({ queryKey: ['roulette', 'round', 'winNumber', table, Number(eventRound)] });
				}
			};
			await Promise.all(landedLogs.map(handleLandedEvent));
		},
	});

	useWatchContractEvent({
		abi: MultiPlayerTableABI,
		address: table,
		eventName: 'BetPlaced',

		onLogs: async (logs) => {
			const handleBetPlacedEvent = async (log: (typeof logs)[0]) => {
				const eventRound = log.args.round;

				await queryClient.invalidateQueries({ queryKey: ['roulette', 'bank'] });
				const betAddress = log.args.bet || ZeroAddress;

				const [player, , amount, winAmount, , created] = await fetchBetInfo(config, betAddress);
				const roundBet: RoundBet = {
					amount: amount,
					winAmount: winAmount,
					created: created,
					round: Number(eventRound),
					winNumber: -1,
					status: RoundStatus.CREATED,
				};

				// Update Table Rounds
				let updatedRounds: RoundBet[];

				if (rounds.some((round) => round.round === roundBet.round)) {
					updatedRounds = rounds.map((round) => {
						if (round.round === roundBet.round) {
							return {
								...round,
								amount: round.amount + roundBet.amount,
							};
						}
						return round;
					});
				} else {
					updatedRounds = [roundBet, ...rounds];
				}
				queryClient.setQueryData(tableRoundsQueryKey, updatedRounds);

				const roundPlayerBet: RoundPlayerBet = { ...roundBet, player };

				// Update Player Rounds
				if (player.toLowerCase() === address.toLowerCase()) {
					let updatedPlayerRound: RoundPlayerBet[];

					if (playerRounds.some((playerRound) => playerRound.round === roundPlayerBet.round)) {
						updatedPlayerRound = playerRounds.map((round) => {
							if (round.round === roundPlayerBet.round) {
								return {
									...round,
									amount: round.amount + roundPlayerBet.amount,
								};
							}
							return round;
						});
					} else {
						updatedPlayerRound = [roundPlayerBet, ...playerRounds];
					}

					queryClient.setQueryData(playerRoundsQueryKey, updatedPlayerRound);
				}

				const playerInProgressBet: PlayerInProgressBet = {
					amount: amount,
					created: created,
					winAmount: winAmount,
					bet: betAddress,
					player: player,
					//we need to implement this, in order to show if the player won or not
					chips: [],
				};

				//Update round bets(side panel)

				let updatedTableSelectedRoundBets: PlayerInProgressBet[] = [];
				if (tableSelectedRoundBets?.length === 0) {
					updatedTableSelectedRoundBets = [playerInProgressBet];
				}
				if (tableSelectedRoundBets && tableSelectedRoundBets?.length > 0) {
					updatedTableSelectedRoundBets = [...tableSelectedRoundBets, playerInProgressBet];
				}

				queryClient.setQueryData(tableSelectedRoundBetsQueryKey, updatedTableSelectedRoundBets);

				//Update round players(side panel)
				let updatedTableRoundPlayers: PlayerRoundBets[];
				if (tableRoundPlayers.some((playerRoundBets) => playerRoundBets.player.toLowerCase() === player.toLowerCase())) {
					updatedTableRoundPlayers = tableRoundPlayers.map((playerRoundBets) => {
						if (playerRoundBets.player.toLowerCase() === player.toLowerCase()) {
							return {
								...playerRoundBets,
								amount: playerRoundBets.amount + amount,
								betCounts: playerRoundBets.betCounts + 1,
							};
						}
						return playerRoundBets;
					});
				} else {
					updatedTableRoundPlayers = [
						...tableRoundPlayers,
						{
							player,
							amount,
							betCounts: 1,
							created,
						},
					];
				}

				queryClient.setQueryData(tableRoundPlayersQueryKey, updatedTableRoundPlayers);

				// update roulette main table
				const bets = await fetchBetBitmaps(config, betAddress);

				const allBets = queryClient.getQueryData<LocalBet[]>(['roulette', 'bets', 'all', table, Number(eventRound)]) || [];
				await queryClient.setQueryData(['roulette', 'bets', 'all', table, Number(eventRound)], [...allBets, ...bets]);
				if (player.toLowerCase() === address.toLowerCase()) {
					await clearAllBets();
					await queryClient.invalidateQueries({ queryKey: ['roulette', 'local', 'bets'] });
				}
			};
			await Promise.all(logs.map(handleBetPlacedEvent));
		},
	});

	return null;
}

export default Watchers;
