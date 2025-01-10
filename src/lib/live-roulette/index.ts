import type { TableConfigHorizontalItem } from '@/src/components/shared/MainTable/tableConfigHorizontal';
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
