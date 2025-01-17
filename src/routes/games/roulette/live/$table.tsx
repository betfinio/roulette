import { VersionValidation } from '@/src/components/VersionValidation';
import { LiveRoulette } from '@/src/components/live-roulette/LiveRoulette';
import { dozenItemsConfig, sideItemsConfig } from '@/src/components/shared/MainTable/SideTable';
import { tableConfigHorizontal } from '@/src/components/shared/MainTable/tableConfigHorizontal';
import { tableConfigVertical } from '@/src/components/shared/MainTable/tableConfigVertical';
import { tableExtraConfigHorizontal, tableExtraConfigVertical } from '@/src/components/shared/MainTable/tableExtraItemsConfig';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED, PUBLIC_LIRO_ADDRESS } from '@/src/global';
import { fillItems } from '@/src/lib/live-roulette';
import { fetchCurrentRoundOfTable } from '@/src/lib/live-roulette/api';
import {
	useFetchTableBetsByBlockHash,
	useGetLiveRouletteTableStats,
	useGetSelectedRound,
	useGetTablePlayerRounds,
	useGetTableRoundPlayers,
	useGetTableRounds,
	useGetTableSelectedRoundBets,
	useLiveRouletteState,
} from '@/src/lib/live-roulette/query';
import { type PlayerInProgressBet, type PlayerRoundBets, type RoundBet, type RoundPlayerBet, WheelStatus } from '@/src/lib/live-roulette/types';
import { mergeAndSummarize } from '@/src/lib/shared';
import { fetchTableByAddress } from '@/src/lib/shared/api';
import { useGetBetInfo, useGetBetsAmountAndBitMapByRound, useGetTableAddress, useRouletteOthersBetsState } from '@/src/lib/shared/query';
import { RoundStatus } from '@/src/lib/shared/types';
import { LiveRouletteABI, MultiPlayerTableABI, ZeroAddress } from '@betfinio/abi';
import { useMediaQuery } from '@betfinio/components/hooks';
import { Toaster } from '@betfinio/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { useEffect, useRef } from 'react';
import { type Address, isAddress } from 'viem';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { z } from 'zod';

const liveRouletteSchema = z.object({
	round: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute('/games/roulette/live/$table')({
	component: RouletteLiveTable,
	validateSearch: zodValidator(liveRouletteSchema),
	loaderDeps: ({ search }) => {
		if (search?.round) {
			return { round: search.round };
		}
		return {};
	},
	loader: async ({ params, context, deps }) => {
		const isValidAddress = isAddress(params.table);
		if (!isValidAddress) {
			throw redirect({ to: '/games/roulette' });
		}

		const isTableExist = await fetchTableByAddress(context.wagmiConfig, params.table as Address);
		if (!isTableExist) {
			throw redirect({ to: '/games/roulette' });
		}

		if (!deps.round) {
			const round = await fetchCurrentRoundOfTable(context.wagmiConfig, params.table as Address);

			throw redirect({
				to: '/games/roulette/live/$table',
				params: { table: params.table },
				search: { round: Number(round?.round) },
			});
		}

		context.queryClient.refetchQueries({ queryKey: ['roulette', 'currentRound'] });
	},
	onError: (e) => {
		console.error(e, 'my error');
		throw redirect({ to: '/games/roulette' });
	},
});

export function RouletteLiveTable() {
	const queryClient = useQueryClient();
	const { updateState } = useLiveRouletteState();
	const { tableAddress } = useGetTableAddress();
	const { mutateAsync: fetchTableBetsByBlockHash } = useFetchTableBetsByBlockHash();
	const { round: selectedRound, isRoundFinished } = useGetSelectedRound();
	const { address = ZeroAddress } = useAccount();

	const { data: rounds = [], queryKey } = useGetTableRounds(50, tableAddress);
	const { data: playerRounds = [], queryKey: playerRoundsQueryKey } = useGetTablePlayerRounds(tableAddress);
	const { mutateAsync: fetchBetInfo } = useGetBetInfo();

	const { data: tableSelectedRoundBets } = useGetTableSelectedRoundBets(tableAddress, selectedRound);
	const { data: tableRoundPlayers = [], queryKey: tableRoundPlayersQueryKey } = useGetTableRoundPlayers(tableAddress, selectedRound);

	const { updateState: updateOthersBetsState } = useRouletteOthersBetsState();

	const { mutateAsync } = useGetBetsAmountAndBitMapByRound();
	const { isVertical } = useMediaQuery();
	const { queryKey: tableStatQueryKey } = useGetLiveRouletteTableStats(tableAddress);

	const tableStatTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		if (isRoundFinished) {
			if (selectedRound && tableAddress) {
				mutateAsync(
					{ round: selectedRound, table: tableAddress },
					{
						onSuccess: (selectedBetChips) => {
							const tableConfig = isVertical ? tableConfigVertical : tableConfigHorizontal;
							const extraItems = isVertical ? tableExtraConfigVertical : tableExtraConfigHorizontal;
							const mapedBets = fillItems(selectedBetChips, {
								...dozenItemsConfig,
								...sideItemsConfig,
								...tableConfig,
								...extraItems,
							});
							const summarizedBets = mergeAndSummarize(mapedBets);
							updateOthersBetsState({ selectedBetChips: summarizedBets });
						},
					},
				);
			}
		} else {
			updateOthersBetsState({ selectedBetChips: null });
		}
	}, [isRoundFinished, selectedRound]);
	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'Requested',
		onLogs: async (rolledLogs) => {
			const eventOfTheTable = rolledLogs[0].args.table?.toString().toLowerCase() === tableAddress?.toLowerCase();
			const requestedRound = rolledLogs[0].args.round;

			if (BigInt(selectedRound ?? 0n) !== requestedRound) {
				return;
			}
			if (eventOfTheTable) {
				updateState({ state: WheelStatus.Requested });
				queryClient.invalidateQueries({ queryKey: ['roulette'] });
			}
		},
	});

	useWatchContractEvent({
		abi: LiveRouletteABI,
		address: PUBLIC_LIRO_ADDRESS,
		eventName: 'RandomGenerated',
		onLogs: async (landedLogs) => {
			const eventOfTheTable = landedLogs[0].args.table?.toString().toLowerCase() === tableAddress?.toLowerCase();
			const randomGeneratedRound = landedLogs[0].args.round;

			const eventOfCurrentlySelectedRound = randomGeneratedRound === BigInt(selectedRound ?? 0n);

			const randomGeneratedOnCurrentTableAndRound = eventOfTheTable && eventOfCurrentlySelectedRound;

			if (randomGeneratedOnCurrentTableAndRound) {
				const round = await fetchTableBetsByBlockHash({
					blockHash: landedLogs[0].blockHash,
					round: randomGeneratedRound || BigInt(0),
				});
				round &&
					updateState({
						state: WheelStatus.Landing,
						result: Number(landedLogs[0].args.value),
						tableRound: round.roundAllBets,
						tablePlayerRound: round.roundPlayerBets || undefined,
					});
				queryClient.invalidateQueries({ queryKey: ['roulette', 'state'] });
			}

			if (eventOfTheTable && !eventOfCurrentlySelectedRound) {
				const round = await fetchTableBetsByBlockHash({
					blockHash: landedLogs[0].blockHash,
					round: randomGeneratedRound || BigInt(0),
				});

				if (round) {
					const { roundAllBets, roundPlayerBets } = round;

					//Populate all bets for the current round
					if (roundAllBets) {
						const updatedRounds = rounds.map((round) => {
							if (round.round === roundAllBets.round) {
								return roundAllBets;
							}
							return round;
						});
						queryClient.setQueryData(queryKey, updatedRounds, {
							updatedAt: Date.now(),
						});
					}

					//Populate all bets for the current round for the player

					if (roundPlayerBets) {
						const updatedPlayerRounds = playerRounds.map((round) => {
							if (round.round === roundPlayerBets.round) {
								return roundPlayerBets;
							}
							return round;
						});

						queryClient.setQueryData(playerRoundsQueryKey, updatedPlayerRounds, {
							updatedAt: Date.now(),
						});
					}
				}
			}
			//Update Stat
			if (tableStatTimeoutRef.current) {
				clearTimeout(tableStatTimeoutRef.current);
			}
			tableStatTimeoutRef.current = setTimeout(() => {
				queryClient.refetchQueries({ queryKey: tableStatQueryKey });
			}, 5000);
		},
	});

	useWatchContractEvent({
		abi: MultiPlayerTableABI,
		address: tableAddress,
		eventName: 'BetPlaced',
		onLogs: async (rolledLogs) => {
			const betPlacedInCurrentRound = rolledLogs[0].args.round === BigInt(selectedRound ?? 0n);
			const betAddress = rolledLogs[0].args.bet || ZeroAddress;

			if (!betPlacedInCurrentRound || selectedRound === undefined) {
				return;
			}

			const [player, , amount, winAmount, , created] = await fetchBetInfo(betAddress);

			const roundAllBets: RoundBet = {
				amount: amount,
				winAmount: winAmount,
				created: created,
				round: Number(selectedRound),
				winNumber: -1,
				status: RoundStatus.CREATED,
			};

			const roundPlayerBets: RoundPlayerBet = { ...roundAllBets, player };

			//Update Table Rounds
			let updatedRounds = [];
			if (rounds.length === 0) {
				updatedRounds = [roundAllBets];
			}

			if (rounds.some((round) => round.round === roundAllBets.round)) {
				updatedRounds = rounds.map((round) => {
					if (round.round === roundAllBets.round) {
						return {
							...round,
							amount: round.amount + roundAllBets.amount,
						};
					}
					return round;
				});
			} else {
				updatedRounds = [roundAllBets, ...rounds];
			}

			queryClient.setQueryData(queryKey, updatedRounds);

			//Update Player Rounds
			if (player.toLowerCase() === address.toLowerCase()) {
				let updatedPlayerRound = [];

				if (playerRounds.length === 0) {
					updatedPlayerRound = [roundPlayerBets];
				}
				if (playerRounds.some((playerRound) => playerRound.round === roundPlayerBets.round)) {
					updatedPlayerRound = playerRounds.map((round) => {
						if (round.round === roundPlayerBets.round) {
							return {
								...round,
								amount: round.amount + roundPlayerBets.amount,
							};
						}
						return round;
					});
				} else {
					updatedPlayerRound = [roundPlayerBets, ...playerRounds];
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

			queryClient.setQueryData(['roulette', 'table', 'bets', tableAddress, selectedRound], updatedTableSelectedRoundBets);

			//Update round players(side panel)
			let updatedTableRoundPlayers: PlayerRoundBets[] = [];
			if (tableRoundPlayers.length === 0) {
				updatedTableRoundPlayers = [
					{
						player,
						amount,
						betCounts: 1,
						created,
					},
				];
			}
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
		},
	});
	return (
		<div className="roulette">
			<LiveRoulette />
			<Toaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</div>
	);
}
