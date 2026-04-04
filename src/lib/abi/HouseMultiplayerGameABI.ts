export const HouseMultiplayerGameABI = [
	{
		type: 'constructor',
		inputs: [
			{
				name: 'admin',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_core',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_liquidityPool',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_token',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_strategy',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_vrfCoordinator',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_betImplementation',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_vrfConfig',
				type: 'tuple',
				internalType: 'struct BaseGame.VrfConfig',
				components: [
					{
						name: 'keyHash',
						type: 'bytes32',
						internalType: 'bytes32',
					},
					{
						name: 'subscriptionId',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'requestConfirmations',
						type: 'uint16',
						internalType: 'uint16',
					},
					{
						name: 'callbackGasLimit',
						type: 'uint32',
						internalType: 'uint32',
					},
				],
			},
			{
				name: '_interval',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'BET_IMPLEMENTATION',
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
		name: 'CORE',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract ICore',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'DEFAULT_ADMIN_ROLE',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'INTERVAL',
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
		name: 'LIQUIDITY_POOL',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract ILiquidityPool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'MAX_BETS_PER_ROUND',
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
		name: 'REFUND_TIMEOUT',
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
		name: 'STRATEGY',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IStrategy',
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
		name: 'getCurrentRoundId',
		inputs: [],
		outputs: [
			{
				name: 'roundId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getRoleAdmin',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getRound',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'bets',
				type: 'address[]',
				internalType: 'address[]',
			},
			{
				name: 'totalBank',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'totalReserved',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'vrfRequestId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'status',
				type: 'uint8',
				internalType: 'enum BaseGame.RoundStatus',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'grantRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'hasRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'placeBet',
		inputs: [
			{
				name: 'player',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'recipient',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
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
				name: 'bet',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'rawFulfillRandomWords',
		inputs: [
			{
				name: 'requestId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'randomWords',
				type: 'uint256[]',
				internalType: 'uint256[]',
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
				name: 'roundId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'renounceRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'callerConfirmation',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'revokeRole',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'settleRound',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'maxBets',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'spin',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'supportsInterface',
		inputs: [
			{
				name: 'interfaceId',
				type: 'bytes4',
				internalType: 'bytes4',
			},
		],
		outputs: [
			{
				name: '',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'transferToRecipient',
		inputs: [
			{
				name: 'recipient',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'vrfConfig',
		inputs: [],
		outputs: [
			{
				name: 'keyHash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: 'subscriptionId',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'requestConfirmations',
				type: 'uint16',
				internalType: 'uint16',
			},
			{
				name: 'callbackGasLimit',
				type: 'uint32',
				internalType: 'uint32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'event',
		name: 'BetPlaced',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'player',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'recipient',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'amountReceived',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'roundId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'reserveAmount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'strategy',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'data',
				type: 'bytes',
				indexed: false,
				internalType: 'bytes',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'BetRefunded',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'player',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'recipient',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'reserveAmount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'BetResolved',
		inputs: [
			{
				name: 'bet',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'player',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'recipient',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'result',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'payout',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'roundId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RandomnessFulfilled',
		inputs: [
			{
				name: 'requestId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'contextId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'randomWord',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RandomnessRequested',
		inputs: [
			{
				name: 'requestId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'contextId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoleAdminChanged',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
			{
				name: 'previousAdminRole',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
			{
				name: 'newAdminRole',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoleGranted',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'sender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoleRevoked',
		inputs: [
			{
				name: 'role',
				type: 'bytes32',
				indexed: true,
				internalType: 'bytes32',
			},
			{
				name: 'account',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'sender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoundCancelled',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoundSettled',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'totalBank',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'totalReserved',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RoundStarted',
		inputs: [
			{
				name: 'roundId',
				type: 'uint256',
				indexed: true,
				internalType: 'uint256',
			},
			{
				name: 'startedAt',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'error',
		name: 'AccessControlBadConfirmation',
		inputs: [],
	},
	{
		type: 'error',
		name: 'AccessControlUnauthorizedAccount',
		inputs: [
			{
				name: 'account',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'neededRole',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
	},
	{
		type: 'error',
		name: 'BetAlreadyResolved',
		inputs: [],
	},
	{
		type: 'error',
		name: 'FailedDeployment',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InsufficientBalance',
		inputs: [
			{
				name: 'balance',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'needed',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
	},
	{
		type: 'error',
		name: 'InvalidAddress',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidBet',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidCoordinator',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidRound',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidVrfConfig',
		inputs: [],
	},
	{
		type: 'error',
		name: 'MaxReserveExceeded',
		inputs: [],
	},
	{
		type: 'error',
		name: 'OnlyCoordinatorCanFulfill',
		inputs: [
			{
				name: 'have',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'want',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'OnlyCore',
		inputs: [],
	},
	{
		type: 'error',
		name: 'OnlyStrategy',
		inputs: [],
	},
	{
		type: 'error',
		name: 'ReentrancyGuardReentrantCall',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RefundTimeoutNotReached',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RoundAlreadySpun',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RoundNotEnded',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RoundNotOpen',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RoundNotSpun',
		inputs: [],
	},
	{
		type: 'error',
		name: 'RoundTooLarge',
		inputs: [],
	},
	{
		type: 'error',
		name: 'SafeERC20FailedOperation',
		inputs: [
			{
				name: 'token',
				type: 'address',
				internalType: 'address',
			},
		],
	},
] as const;
