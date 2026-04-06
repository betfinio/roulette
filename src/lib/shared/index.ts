import type { Address } from 'viem';
import { type LastResult, type LocalBet, RoundStatus } from './types';

export function encodeBet(bet: LocalBet) {
	const value: bigint = bet.numbers.reduce((sum, num) => {
		return sum + 2n ** BigInt(num);
	}, 0n);

	return { amount: BigInt(bet.amount) * 10n ** 18n, bitmap: value };
}

export function decodeBet(encoded: { amount: bigint; bitmap: bigint; player?: Address }): LocalBet {
	// Decode numbers from the bitmap
	const numbers: number[] = [];
	let bitmap = encoded.bitmap;
	let index = 0;

	while (bitmap > 0n) {
		if (bitmap & 1n) {
			numbers.push(index); // Add the current bit position to the numbers array
		}
		bitmap >>= 1n; // Shift bitmap to the right
		index++;
	}

	// Decode amount (convert from WEI to original amount)
	const amount = Number(encoded.amount / 10n ** 18n);

	// Reconstruct the LocalBet object
	return {
		numbers,
		amount,
		player: encoded.player,
		item: '', // Placeholder since item isn't encoded in the original representation
	};
}

export const lastResultPlaceholder: LastResult[] = [
	{
		status: RoundStatus.FINISHED,
		winNumber: 1,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 2,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 3,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 4,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 5,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 6,
	},
	{
		status: RoundStatus.FINISHED,
		winNumber: 0,
	},
];

export function mergeAndSummarize(objects: LocalBet[]): LocalBet[] {
	const mergedMap: Map<string, LocalBet> = new Map();

	for (const obj of objects) {
		// Same layout can have bets from multiple players — key must include player so we don't clobber `player`
		const playerKey = typeof obj.player === 'string' ? obj.player.toLowerCase() : '';
		const key = `${obj.item}\0${playerKey}`;

		const existing = mergedMap.get(key);

		if (existing) {
			// Merge the amounts and retain unique numbers
			existing.amount += obj.amount;
			existing.numbers = Array.from(new Set([...existing.numbers, ...obj.numbers]));
			existing.player = obj.player;
		} else {
			// Add new entry
			mergedMap.set(key, { ...obj });
		}
	}

	// Convert Map back to an array
	return Array.from(mergedMap.values());
}
