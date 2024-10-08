export interface RacetrackConfigItem {
	relatedNumbers?: number[];
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

export const racetrackConfig: {
	[key: string]: RacetrackConfigItem;
} = {
	'SERIE 5/8': {
		relatedNumbers: [5, 8, 10, 11, 13, 16, 23, 24, 27, 30, 33, 36],
		className: 'serie-5-8',
	},
	ORPHELINS: {
		relatedNumbers: [1, 6, 9, 14, 17, 20, 31, 34],
		className: 'orphelins',
	},
	'SERIE 0/2/3': {
		relatedNumbers: [0, 2, 3, 4, 7, 12, 15, 18, 21, 19, 22, 25, 26, 28, 29, 32, 35],
		className: 'serie-0-2-3',
	},
	'ZERO SPIEL': {
		relatedNumbers: [0, 3, 12, 15, 26, 32, 35],
		className: 'zero-spiel',
	},
};
