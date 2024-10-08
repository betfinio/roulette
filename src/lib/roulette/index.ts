import type { LocalBet, RouletteSubBet } from '@/src/lib/roulette/types.ts';
import type { Address } from 'viem';

export const betCodes: Record<string, number> = {
	'0': 14,
	'3': 1,
	'6': 2,
	'9': 3,
	'12': 4,
	'15': 5,
	'18': 6,
	'21': 7,
	'24': 8,
	'27': 9,
	'30': 10,
	'33': 11,
	'36': 12,
	'2': 15,
	'5': 16,
	'8': 17,
	'11': 18,
	'14': 19,
	'17': 20,
	'20': 21,
	'23': 22,
	'26': 23,
	'29': 24,
	'32': 25,
	'35': 26,
	'1': 29,
	'4': 30,
	'7': 31,
	'10': 32,
	'13': 33,
	'16': 34,
	'19': 35,
	'22': 36,
	'25': 37,
	'28': 38,
	'31': 39,
	'34': 40,
	'0&1': 1028,
	'0&1&2': 114,
	'0&1&2&3': 128,
	'0&2': 1014,
	'0&2&3': 100,
	'0&3': 1000,
	'1&2': 10015,
	'1&2&3': 10029,
	'1&2&3&4&5&6&7&8&9&10&11&12': 20000,
	'1&2&3&4&5&6&7&8&9&10&11&12&13&14&15&16&17&18': 20003,
	'1&2&4&5': 115,
	'1&3&5&7&9&11&13&15&17&19&21&23&25&27&29&31&33&35': 20006,
	'1&3&5&7&9&12&14&16&18&19&21&23&25&27&30&32&34&36': 20008,
	'1&4': 1029,
	'1&4&7&10&13&16&19&22&25&28&31&34': 41,
	'2&3': 10001,
	'2&3&5&6': 101,
	'2&4&6&8&10&11&13&15&17&20&22&24&26&28&29&31&33&35': 20007,
	'2&4&6&8&10&12&14&16&18&20&22&24&26&28&30&32&34&36': 20005,
	'2&5': 1015,
	'2&5&8&11&14&17&20&23&26&29&32&35': 27,
	'3&6': 1001,
	'3&6&9&12&15&18&21&24&27&30&33&36': 13,
	'4&5': 10016,
	'4&5&6': 10030,
	'4&5&7&8': 116,
	'4&7': 1030,
	'5&6': 10002,
	'5&6&8&9': 102,
	'5&8': 1016,
	'6&9': 1002,
	'7&8': 10017,
	'7&8&9': 10031,
	'7&8&10&11': 117,
	'7&10': 1031,
	'8&9': 10003,
	'8&9&11&12': 103,
	'8&11': 1017,
	'9&12': 1003,
	'10&11': 10018,
	'10&11&12': 10032,
	'10&11&13&14': 118,
	'10&13': 1032,
	'11&12': 10004,
	'11&12&14&15': 104,
	'11&14': 1018,
	'12&15': 1004,
	'13&14': 10019,
	'13&14&15': 10033,
	'13&14&15&16&17&18&19&20&21&22&23&24': 20001,
	'13&14&16&17': 119,
	'13&16': 1033,
	'14&15': 10005,
	'14&15&17&18': 105,
	'14&17': 1019,
	'15&18': 1005,
	'16&17': 10020,
	'16&17&18': 10034,
	'16&17&19&20': 120,
	'16&19': 1034,
	'17&18': 10006,
	'17&18&20&21': 106,
	'17&20': 1020,
	'18&21': 1006,
	'19&20': 10021,
	'19&20&21': 10035,
	'19&20&21&22&23&24&25&26&27&28&29&30&31&32&33&34&35&36': 20004,
	'19&20&22&23': 121,
	'19&22': 1035,
	'20&21': 10007,
	'20&21&23&24': 107,
	'20&23': 1021,
	'21&24': 1007,
	'22&23': 10022,
	'22&23&24': 10036,
	'22&23&25&26': 122,
	'22&25': 1036,
	'23&24': 10008,
	'23&24&26&27': 108,
	'23&26': 1022,
	'24&27': 1008,
	'25&26': 10023,
	'25&26&27': 10037,
	'25&26&27&28&29&30&31&32&33&34&35&36': 20002,
	'25&26&28&29': 123,
	'25&28': 1037,
	'26&27': 10009,
	'26&27&29&30': 109,
	'26&29': 1023,
	'27&30': 1009,
	'28&29': 10024,
	'28&29&30': 10038,
	'28&29&31&32': 124,
	'28&31': 1038,
	'29&30': 10010,
	'29&30&32&33': 110,
	'29&32': 1024,
	'30&33': 1010,
	'31&32': 10025,
	'31&32&33': 10039,
	'31&32&34&35': 125,
	'31&34': 1039,
	'32&33': 10011,
	'32&33&35&36': 111,
	'32&35': 1025,
	'33&36': 1011,
	'34&35': 10026,
	'34&35&36': 10040,
	'35&36': 10012,
};

export function encodeBet(bet: LocalBet): bigint[] {
	const value: bigint = bet.numbers.reduce((sum, num) => {
		return sum + 2n ** BigInt(num);
	}, 0n);
	return [BigInt(bet.amount) * 10n ** 18n, value];
}

export function getColor(num: number): 'RED' | 'BLACK' | 'GREEN' {
	if (num === 0) return 'GREEN';
	if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 36, 34].includes(num)) return 'RED';
	return 'BLACK';
}

export const getBlack = () => {
	return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
};

export const getRed = () => {
	return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 36, 34];
};

export const addressToColor = (walletAddress: Address) => {
	if (!walletAddress) return '#ffffff';
	const walletHash = walletAddress.substring(2);
	const chunkLength = Math.floor(walletHash.length / 3);
	const [firstChunk, secondChunk, thirdChunk] = [
		walletHash.substring(0, chunkLength),
		walletHash.substring(chunkLength, chunkLength * 2),
		walletHash.substring(chunkLength * 2, walletHash.length),
	];

	const red = Number.parseInt(firstChunk, 16) % 256;
	const green = Number.parseInt(secondChunk, 16) % 256;
	const blue = Number.parseInt(thirdChunk, 16) % 256;
	const result = [red, green, blue].map((color) => `${color < 16 ? '0' : ''}${color.toString(16)}`).join('');
	return `#${result}`;
};

export function bitMapToNumbers(bet: RouletteSubBet): { amount: bigint; numbers: number[]; value: number } {
	const { amount, bitmap } = bet;
	const binaryString = bitmap.toString(2);
	const numbers: number[] = [];

	for (let i = binaryString.length - 1; i >= 0; i--) {
		if (binaryString[i] === '1') {
			numbers.push(binaryString.length - 1 - i);
		}
	}

	return { numbers, amount, value: betCodes[numbers.join('&')] };
}

export const getChipColor = (value: number) => {
	if (value <= 1000) return 'var(--blue)';
	if (value <= 5000) return 'var(--blue-purple)';
	if (value <= 10000) return 'var(--purple-lighter)';
	if (value <= 50000) return 'var(--orange)';
	return 'var(--yellow)';
};
