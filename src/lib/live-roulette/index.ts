import type { TableConfigHorizontalItem } from '@/src/components/shared/MainTable/tableConfigHorizontal';
import { getColor } from '../roulette';
import type { LocalBet } from '../shared/types';

//this function is used to encode the bet and find position needed for place internaly
export function fillItems(bets: LocalBet[], tableConfig: { [key: string]: TableConfigHorizontalItem }): LocalBet[] {
	return bets.map((bet) => {
		let item = '';

		for (const [key, config] of Object.entries(tableConfig)) {
			for (const [selectionKey, selectionArray] of Object.entries(config)) {
				// Skip non-selection keys (like `className`)
				if (!selectionKey.endsWith('Selection')) continue;

				// Check if `numbers` matches the current selection array
				if (bet.numbers.length === selectionArray.length && bet.numbers.every((num, idx) => num === selectionArray[idx])) {
					// Remove "Selection" and build the item string
					const cleanedKey = selectionKey.replace('Selection', '');
					item = `${key}-${cleanedKey}`;
					break;
				}
			}

			if (item) break; // Stop searching if item is already found
		}

		// Return the bet with the updated item
		return { ...bet, item };
	});
}

// ignore number 0
export const getRouletteStat = (
	numbers: { count: number; number: number }[],
): { odd: number; even: number; red: number; black: number; totalRolls: number } => {
	const odd = numbers.filter((number) => number.number % 2 === 1 && number.number !== 0 && number.number !== 0).reduce((acc, number) => acc + number.count, 0);
	const even = numbers.filter((number) => number.number % 2 === 0 && number.number !== 0 && number.number !== 0).reduce((acc, number) => acc + number.count, 0);
	const red = numbers
		.filter((number) => getColor(number.number) === 'RED' && number.number !== 0 && number.number !== 0)
		.reduce((acc, number) => acc + number.count, 0);
	const black = numbers
		.filter((number) => getColor(number.number) === 'BLACK' && number.number !== 0 && number.number !== 0)
		.reduce((acc, number) => acc + number.count, 0);
	const totalRolls = numbers.reduce((acc, number) => acc + number.count, 0);
	return {
		odd: Math.round((odd / totalRolls) * 100),
		even: Math.round((even / totalRolls) * 100),
		red: Math.round((red / totalRolls) * 100),
		black: Math.round((black / totalRolls) * 100),
		totalRolls,
	};
};
