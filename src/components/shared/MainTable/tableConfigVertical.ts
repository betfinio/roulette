export interface TableConfigVerticalItem {
	centerSelection?: number[];
	topSelection?: number[];
	leftSelection?: number[];
	rightSelection?: number[];
	bottomSelection?: number[];
	topLeftSelection?: number[];
	topRightSelection?: number[];
	bottomLeftSelection?: number[];
	bottomRightSelection?: number[];
	className?: string;
}

export const tableConfigVertical: {
	[key: string]: TableConfigVerticalItem;
} = {
	1: {
		centerSelection: [1],
		topSelection: [0, 1],
		leftSelection: [1, 2, 3],
		topLeftSelection: [0, 1, 2, 3],
		className: 'bg-red-roulette',
	},
	2: {
		centerSelection: [2],
		topSelection: [0, 2],
		leftSelection: [1, 2],
		topLeftSelection: [0, 1, 2],
		className: 'bg-black-roulette',
	},
	3: {
		centerSelection: [3],
		topSelection: [0, 3],
		leftSelection: [2, 3],
		rightSelection: [1, 2, 3],
		topLeftSelection: [0, 2, 3],
		topRightSelection: [0, 1, 2, 3],
		className: 'bg-red-roulette',
	},
	4: {
		centerSelection: [4],
		topSelection: [1, 4],
		leftSelection: [4, 5, 6],
		topLeftSelection: [1, 2, 3, 4, 5, 6],
		className: 'bg-black-roulette',
	},
	5: {
		centerSelection: [5],
		topSelection: [2, 5],
		leftSelection: [4, 5],
		topLeftSelection: [1, 2, 4, 5],
		className: 'bg-red-roulette',
	},
	6: {
		centerSelection: [6],
		topSelection: [3, 6],
		leftSelection: [5, 6],
		rightSelection: [4, 5, 6],
		topLeftSelection: [2, 3, 5, 6],
		topRightSelection: [1, 2, 3, 4, 5, 6],
		className: 'bg-black-roulette',
	},
	7: {
		centerSelection: [7],
		topSelection: [4, 7],
		leftSelection: [7, 8, 9],
		topLeftSelection: [4, 5, 6, 7, 8, 9],
		className: 'bg-red-roulette',
	},
	8: {
		centerSelection: [8],
		topSelection: [5, 8],
		leftSelection: [7, 8],
		topLeftSelection: [4, 5, 7, 8],
		className: 'bg-black-roulette',
	},
	9: {
		centerSelection: [9],
		topSelection: [6, 9],
		leftSelection: [8, 9],
		rightSelection: [7, 8, 9],
		topLeftSelection: [5, 6, 8, 9],
		topRightSelection: [4, 5, 6, 7, 8, 9],
		className: 'bg-red-roulette',
	},
	10: {
		centerSelection: [10],
		topSelection: [7, 10],
		leftSelection: [10, 11, 12],
		topLeftSelection: [7, 8, 9, 10, 11, 12],
		className: 'bg-black-roulette',
	},
	11: {
		centerSelection: [11],
		topSelection: [8, 11],
		leftSelection: [10, 11],
		topLeftSelection: [7, 8, 10, 11],
		className: 'bg-black-roulette',
	},
	12: {
		centerSelection: [12],
		topSelection: [9, 12],
		leftSelection: [11, 12],
		rightSelection: [10, 11, 12],
		topLeftSelection: [8, 9, 11, 12],
		topRightSelection: [7, 8, 9, 10, 11, 12],
		className: 'bg-red-roulette',
	},
	13: {
		centerSelection: [13],
		topSelection: [10, 13],
		leftSelection: [13, 14, 15],
		topLeftSelection: [10, 11, 12, 13, 14, 15],
		className: 'bg-black-roulette',
	},
	14: {
		centerSelection: [14],
		topSelection: [11, 14],
		leftSelection: [13, 14],
		topLeftSelection: [10, 11, 13, 14],
		className: 'bg-red-roulette',
	},
	15: {
		centerSelection: [15],
		topSelection: [12, 15],
		leftSelection: [14, 15],
		rightSelection: [13, 14, 15],
		topLeftSelection: [11, 12, 14, 15],
		topRightSelection: [10, 11, 12, 13, 14, 15],
		className: 'bg-black-roulette',
	},
	16: {
		centerSelection: [16],
		topSelection: [13, 16],
		leftSelection: [16, 17, 18],
		topLeftSelection: [13, 14, 15, 16, 17, 18],
		className: 'bg-red-roulette',
	},
	17: {
		centerSelection: [17],
		topSelection: [14, 17],
		leftSelection: [16, 17],
		topLeftSelection: [13, 14, 16, 17],
		className: 'bg-black-roulette',
	},
	18: {
		centerSelection: [18],
		topSelection: [15, 18],
		leftSelection: [17, 18],
		rightSelection: [16, 17, 18],
		topLeftSelection: [14, 15, 17, 18],
		topRightSelection: [13, 14, 15, 16, 17, 18],
		className: 'bg-red-roulette',
	},
	19: {
		centerSelection: [19],
		topSelection: [16, 19],
		leftSelection: [19, 20, 21],
		topLeftSelection: [16, 17, 18, 19, 20, 21],
		className: 'bg-red-roulette',
	},
	20: {
		centerSelection: [20],
		topSelection: [17, 20],
		leftSelection: [19, 20],
		topLeftSelection: [16, 17, 19, 20],
		className: 'bg-black-roulette',
	},
	21: {
		centerSelection: [21],
		topSelection: [18, 21],
		leftSelection: [20, 21],
		rightSelection: [19, 20, 21],
		topLeftSelection: [17, 18, 20, 21],
		topRightSelection: [16, 17, 18, 19, 20, 21],
		className: 'bg-red-roulette',
	},
	22: {
		centerSelection: [22],
		topSelection: [19, 22],
		leftSelection: [22, 23, 24],
		topLeftSelection: [19, 20, 21, 22, 23, 24],
		className: 'bg-black-roulette',
	},
	23: {
		centerSelection: [23],
		topSelection: [20, 23],
		leftSelection: [22, 23],
		topLeftSelection: [19, 20, 22, 23],
		className: 'bg-red-roulette',
	},
	24: {
		centerSelection: [24],
		topSelection: [21, 24],
		leftSelection: [23, 24],
		rightSelection: [22, 23, 24],
		topLeftSelection: [20, 21, 23, 24],
		topRightSelection: [19, 20, 21, 22, 23, 24],
		className: 'bg-black-roulette',
	},
	25: {
		centerSelection: [25],
		topSelection: [22, 25],
		leftSelection: [25, 26, 27],
		topLeftSelection: [22, 23, 24, 25, 26, 27],
		className: 'bg-red-roulette',
	},
	26: {
		centerSelection: [26],
		topSelection: [23, 26],
		leftSelection: [25, 26],
		topLeftSelection: [22, 23, 25, 26],
		className: 'bg-black-roulette',
	},
	27: {
		centerSelection: [27],
		topSelection: [24, 27],
		leftSelection: [26, 27],
		rightSelection: [25, 26, 27],
		topLeftSelection: [23, 24, 26, 27],
		topRightSelection: [22, 23, 24, 25, 26, 27],
		className: 'bg-red-roulette',
	},
	28: {
		centerSelection: [28],
		topSelection: [25, 28],
		leftSelection: [28, 29, 30],
		topLeftSelection: [25, 26, 27, 28, 29, 30],
		className: 'bg-black-roulette',
	},
	29: {
		centerSelection: [29],
		topSelection: [26, 29],
		leftSelection: [28, 29],
		topLeftSelection: [25, 26, 28, 29],
		className: 'bg-black-roulette',
	},
	30: {
		centerSelection: [30],
		topSelection: [27, 30],
		leftSelection: [29, 30],
		rightSelection: [28, 29, 30],
		topLeftSelection: [26, 27, 29, 30],
		topRightSelection: [25, 26, 27, 28, 29, 30],
		className: 'bg-red-roulette',
	},
	31: {
		centerSelection: [31],
		topSelection: [28, 31],
		leftSelection: [31, 32, 33],
		topLeftSelection: [28, 29, 30, 31, 32, 33],
		className: 'bg-black-roulette',
	},
	32: {
		centerSelection: [32],
		topSelection: [29, 32],
		leftSelection: [31, 32],
		topLeftSelection: [28, 29, 31, 32],
		className: 'bg-red-roulette',
	},
	33: {
		centerSelection: [33],
		topSelection: [30, 33],
		leftSelection: [32, 33],
		rightSelection: [31, 32, 33],
		topLeftSelection: [29, 30, 32, 33],
		topRightSelection: [28, 29, 30, 31, 32, 33],
		className: 'bg-black-roulette',
	},
	34: {
		centerSelection: [34],
		topSelection: [31, 34],
		leftSelection: [34, 35, 36],
		topLeftSelection: [31, 32, 33, 34, 35, 36],
		className: 'bg-red-roulette',
	},
	35: {
		centerSelection: [35],
		topSelection: [32, 35],
		leftSelection: [34, 35],
		topLeftSelection: [31, 32, 34, 35],
		className: 'bg-black-roulette',
	},
	36: {
		centerSelection: [36],
		topSelection: [33, 36],
		leftSelection: [35, 36],
		rightSelection: [34, 35, 36],
		topLeftSelection: [32, 33, 35, 36],
		topRightSelection: [31, 32, 33, 34, 35, 36],
		className: 'bg-red-roulette',
	},
};
