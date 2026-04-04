export const RouletteSinglePlayerStrategyABI = [
	{
		type: 'constructor',
		inputs: [
			{
				name: '_game',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_token',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_staking',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'GAME',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'MAX_SUB_BETS',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'STAKING',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'TOKEN',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IERC20',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getBitmapPayout',
		inputs: [
			{
				name: 'bitmap',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'payout',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'minBet',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'maxBet',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getNumRandomWords',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint32',
				internalType: 'uint32',
			},
		],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'getNumRandomWordsForRound',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint32',
				internalType: 'uint32',
			},
		],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'getSubBets',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: '',
				type: 'tuple[]',
				internalType: 'struct RouletteLib.SubBet[]',
				components: [
					{
						name: 'amount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'bitmap',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'maxBets',
		inputs: [
			{
				name: 'bitmap',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'max',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'minBets',
		inputs: [
			{
				name: 'bitmap',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'min',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'payouts',
		inputs: [
			{
				name: 'bitmap',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'payout',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'processRoundSlice',
		inputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'refundBet',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'refundRound',
		inputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'resolveHouseBet',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'randomWords',
				type: 'uint256[]',
				internalType: 'uint256[]',
			},
		],
		outputs: [
			{
				name: 'winAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'resolveRound',
		inputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256[]',
				internalType: 'uint256[]',
			},
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'validateBet',
		inputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'bet',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'data',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [
			{
				name: 'reserveAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'error',
		name: 'BetTooLarge',
		inputs: [],
	},
	{
		type: 'error',
		name: 'BetTooSmall',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidBitmap',
		inputs: [],
	},
	{
		type: 'error',
		name: 'NoSubBets',
		inputs: [],
	},
	{
		type: 'error',
		name: 'OnlyGame',
		inputs: [],
	},
	{
		type: 'error',
		name: 'TooManySubBets',
		inputs: [],
	},
] as const;
