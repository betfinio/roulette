export const CoreABI = [
	{
		type: 'constructor',
		inputs: [],
		stateMutability: 'nonpayable',
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
		name: 'DEFAULT_INVITER_REWARD_BPS',
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
		name: 'DEFAULT_PARTNER_SHARE_BPS',
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
		name: 'DEFAULT_POOL_AFFILIATE_BONUS_BPS',
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
		name: 'DEFAULT_POOL_PARTNER_FEE_BPS',
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
		name: 'GAME_CONNECT_ROLE',
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
		name: 'GAME_REMOVER_ROLE',
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
		name: 'GATEWAY_REGISTRY_ROLE',
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
		name: 'MAX_BPS',
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
		name: 'MAX_INVITER_REWARD_BPS',
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
		name: 'MAX_MANAGER_FEE_BPS',
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
		name: 'MAX_PARTNER_SHARE_BPS',
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
		name: 'MAX_POOL_AFFILIATE_BONUS_BPS',
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
		name: 'MAX_POOL_PARTNER_FEE_BPS',
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
		name: 'MIN_POOL_AFFILIATE_BONUS_BPS',
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
		name: 'POOL_REGISTRY_ROLE',
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
		name: 'SET_INVITER_REWARD_ROLE',
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
		name: 'SET_PARTNER_SHARE_ROLE',
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
		name: 'SET_POOL_AFFILIATE_BONUS_ROLE',
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
		name: 'SET_POOL_PARTNER_FEE_ROLE',
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
		name: 'UPGRADER_ROLE',
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
		name: 'UPGRADE_INTERFACE_VERSION',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'string',
				internalType: 'string',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'bet',
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
				name: 'game',
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
			{
				name: 'partner',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: 'betAddress',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'calculatePartnerFee',
		inputs: [
			{
				name: 'game',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'betAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'fee',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'calculatePoolFee',
		inputs: [
			{
				name: 'depositAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [
			{
				name: 'fee',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'connectGame',
		inputs: [
			{
				name: 'game',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'config',
				type: 'tuple',
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'currentBetPayer',
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
		name: 'deposit',
		inputs: [
			{
				name: 'provider',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'liquidityPool',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'minShares',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'partner',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: 'tokenId',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'disconnectGame',
		inputs: [
			{
				name: 'game',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'getGameConfig',
		inputs: [
			{
				name: 'game',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: 'config',
				type: 'tuple',
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getInviterRewardBps',
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
		name: 'getPartnerShareBps',
		inputs: [],
		outputs: [
			{
				name: 'shareBps',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getPass',
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
		name: 'getPoolAffiliateBonusBps',
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
		name: 'getPoolPartnerFeeBps',
		inputs: [],
		outputs: [
			{
				name: 'feeBps',
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
		name: 'getToken',
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
		name: 'initialize',
		inputs: [
			{
				name: 'admin',
				type: 'address',
				internalType: 'address',
			},
			{
				name: '_token',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'inviterRewardBps',
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
		name: 'isGameRegistered',
		inputs: [
			{
				name: 'game',
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
		name: 'isGateway',
		inputs: [
			{
				name: 'gateway',
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
		name: 'isLiquidityPool',
		inputs: [
			{
				name: 'liquidityPool',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [
			{
				name: 'registered',
				type: 'bool',
				internalType: 'bool',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'partnerShareBps',
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
		name: 'pass',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract IPass',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'poolAffiliateBonusBps',
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
		name: 'poolPartnerFeeBps',
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
		name: 'proxiableUUID',
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
		name: 'registerGateway',
		inputs: [
			{
				name: 'gateway',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'registerLiquidityPool',
		inputs: [
			{
				name: 'liquidityPool',
				type: 'address',
				internalType: 'address',
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
		name: 'setInviterRewardBps',
		inputs: [
			{
				name: 'bps',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setPartnerShareBps',
		inputs: [
			{
				name: 'bps',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setPass',
		inputs: [
			{
				name: '_pass',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setPoolAffiliateBonusBps',
		inputs: [
			{
				name: 'bps',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setPoolPartnerFeeBps',
		inputs: [
			{
				name: 'bps',
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
		name: 'token',
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
		name: 'unregisterGateway',
		inputs: [
			{
				name: 'gateway',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'unregisterLiquidityPool',
		inputs: [
			{
				name: 'liquidityPool',
				type: 'address',
				internalType: 'address',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'updateGameConfig',
		inputs: [
			{
				name: 'game',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'config',
				type: 'tuple',
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'upgradeToAndCall',
		inputs: [
			{
				name: 'newImplementation',
				type: 'address',
				internalType: 'address',
			},
			{
				name: 'data',
				type: 'bytes',
				internalType: 'bytes',
			},
		],
		outputs: [],
		stateMutability: 'payable',
	},
	{
		type: 'event',
		name: 'BetRouted',
		inputs: [
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
				name: 'game',
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
				name: 'partner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'partnerFee',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'managerFee',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'bet',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'poolFee',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'liquidityPool',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
			{
				name: 'platformEdge',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'inviterReward',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'CoreInitialized',
		inputs: [
			{
				name: 'token',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'poolAffiliateBonusBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'poolPartnerFeeBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'partnerShareBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'inviterRewardBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'DepositRouted',
		inputs: [
			{
				name: 'provider',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'liquidityPool',
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
				name: 'partner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'partnerFee',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'tokenId',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
			{
				name: 'affiliateBonus',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GameConfigUpdated',
		inputs: [
			{
				name: 'game',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'config',
				type: 'tuple',
				indexed: false,
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GameConnected',
		inputs: [
			{
				name: 'game',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'config',
				type: 'tuple',
				indexed: false,
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GameDisconnected',
		inputs: [
			{
				name: 'game',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'config',
				type: 'tuple',
				indexed: false,
				internalType: 'struct ICore.GameConfig',
				components: [
					{
						name: 'gameType',
						type: 'uint8',
						internalType: 'enum ICore.GameType',
					},
					{
						name: 'liquidityPool',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'rtpBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'feeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'gameManager',
						type: 'address',
						internalType: 'address',
					},
					{
						name: 'managerFeeBps',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'maxReserve',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'registered',
						type: 'bool',
						internalType: 'bool',
					},
				],
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GatewayRegistered',
		inputs: [
			{
				name: 'gateway',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'GatewayUnregistered',
		inputs: [
			{
				name: 'gateway',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Initialized',
		inputs: [
			{
				name: 'version',
				type: 'uint64',
				indexed: false,
				internalType: 'uint64',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'InviterRewardUpdated',
		inputs: [
			{
				name: 'newBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'LiquidityPoolRegistered',
		inputs: [
			{
				name: 'liquidityPool',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'LiquidityPoolUnregistered',
		inputs: [
			{
				name: 'liquidityPool',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'ManagerFeePaid',
		inputs: [
			{
				name: 'manager',
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
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'ManagerFeeSkipped',
		inputs: [
			{
				name: 'manager',
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
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PartnerFeePaid',
		inputs: [
			{
				name: 'partner',
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
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PartnerFeeSkipped',
		inputs: [
			{
				name: 'partner',
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
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PartnerShareUpdated',
		inputs: [
			{
				name: 'newBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PassUpdated',
		inputs: [
			{
				name: 'pass',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PoolAffiliateBonusUpdated',
		inputs: [
			{
				name: 'newBps',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'PoolPartnerFeeUpdated',
		inputs: [
			{
				name: 'newBps',
				type: 'uint256',
				indexed: false,
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
		name: 'Upgraded',
		inputs: [
			{
				name: 'implementation',
				type: 'address',
				indexed: true,
				internalType: 'address',
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
		name: 'AddressEmptyCode',
		inputs: [
			{
				name: 'target',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'ERC1967InvalidImplementation',
		inputs: [
			{
				name: 'implementation',
				type: 'address',
				internalType: 'address',
			},
		],
	},
	{
		type: 'error',
		name: 'ERC1967NonPayable',
		inputs: [],
	},
	{
		type: 'error',
		name: 'FailedCall',
		inputs: [],
	},
	{
		type: 'error',
		name: 'FeesImmutable',
		inputs: [],
	},
	{
		type: 'error',
		name: 'GameAlreadyRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'GameNotRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'GatewayAlreadyRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'GatewayNotRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidAddress',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidAmount',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidConfig',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidFee',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidInitialization',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidManagerFee',
		inputs: [],
	},
	{
		type: 'error',
		name: 'InvalidRtp',
		inputs: [],
	},
	{
		type: 'error',
		name: 'LiquidityPoolAlreadyRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'LiquidityPoolNotRegistered',
		inputs: [],
	},
	{
		type: 'error',
		name: 'NotAMember',
		inputs: [],
	},
	{
		type: 'error',
		name: 'NotInitializing',
		inputs: [],
	},
	{
		type: 'error',
		name: 'ReentrancyGuardReentrantCall',
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
	{
		type: 'error',
		name: 'UUPSUnauthorizedCallContext',
		inputs: [],
	},
	{
		type: 'error',
		name: 'UUPSUnsupportedProxiableUUID',
		inputs: [
			{
				name: 'slot',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
	},
] as const;
