export function getColor(num: number): 'RED' | 'BLACK' | 'GREEN' | undefined {
	if (num === 0) return 'GREEN';
	if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 36, 34].includes(num)) return 'RED';
	if ([2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(num)) return 'BLACK';
	return undefined;
}

export const getBlack = () => {
	return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
};

export const getRed = () => {
	return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
};

export const getChipColor = (value: number) => {
	if (value <= 10000) return 'var(--blue-purple)';
	if (value <= 25000) return 'var(--purple-lighter)';
	if (value <= 100_000) return 'var(--green)';
	if (value <= 500_000) return 'var(--orange)';
	if (value <= 2000000) return 'var(--yellow)';
	return 'var(--blue)';
};

export const getGridNumbers = (isVertical: boolean): string[] => {
	if (isVertical) {
		return Array.from({ length: 36 }, (_, index) => (index + 1).toString());
	}
	return [
		'3',
		'6',
		'9',
		'12',
		'15',
		'18',
		'21',
		'24',
		'27',
		'30',
		'33',
		'36',
		'2',
		'5',
		'8',
		'11',
		'14',
		'17',
		'20',
		'23',
		'26',
		'29',
		'32',
		'35',
		'1',
		'4',
		'7',
		'10',
		'13',
		'16',
		'19',
		'22',
		'25',
		'28',
		'31',
		'34',
	];
};

export const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);

// Function to generate European roulette numbers with alternating colors
export const getWheelNumbers = () => [
	'0',
	'32',
	'15',
	'19',
	'4',
	'21',
	'2',
	'25',
	'17',
	'34',
	'6',
	'27',
	'13',
	'36',
	'11',
	'30',
	'8',
	'23',
	'10',
	'5',
	'24',
	'16',
	'33',
	'1',
	'20',
	'14',
	'31',
	'9',
	'22',
	'18',
	'29',
	'7',
	'28',
	'12',
	'35',
	'3',
	'26',
];

// Function to format the time for display
export const formatTime = (milliseconds: number): string => {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(totalSeconds / 60)
		.toString()
		.padStart(2, '0');
	const seconds = (totalSeconds % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
};
