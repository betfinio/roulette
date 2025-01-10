export interface TableConfigHorizontalItem {
	centerSelection?: number[];
}

export const tableExtraConfigHorizontal: {
	[key: string]: TableConfigHorizontalItem;
} = {
	'1st': {
		centerSelection: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
	},
	'2nd': {
		centerSelection: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
	},
	'3rd': {
		centerSelection: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
	},
};

const numbersVertical = Array.from({ length: 36 }, (_, index) => index + 1);

export const tableExtraConfigVertical: {
	[key: string]: TableConfigHorizontalItem;
} = {
	'1st': {
		centerSelection: numbersVertical.filter((n) => (n - 1) % 3 === 0),
	},
	'2nd': {
		centerSelection: numbersVertical.filter((n) => (n - 2) % 3 === 0),
	},
	'3rd': {
		centerSelection: numbersVertical.filter((n) => n % 3 === 0),
	},
};
