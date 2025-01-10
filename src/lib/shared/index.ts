import { type LastResult, type LocalBet, RoundStatus } from './types';

export function encodeBet(bet: LocalBet) {
	const value: bigint = bet.numbers.reduce((sum, num) => {
		return sum + 2n ** BigInt(num);
	}, 0n);

	return { amount: BigInt(bet.amount) * 10n ** 18n, bitmap: value };
}

export function decodeBet(encoded: { amount: bigint; bitmap: bigint }): LocalBet {
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
