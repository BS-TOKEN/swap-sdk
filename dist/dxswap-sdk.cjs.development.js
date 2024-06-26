'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSBI = _interopDefault(require('jsbi'));
var invariant = _interopDefault(require('tiny-invariant'));
var address = require('@ethersproject/address');
var _contracts_json = require('dxswap-core/.contracts.json');
var _contracts_json$1 = require('dxswap-periphery/.contracts.json');
var _Big = _interopDefault(require('big.js'));
var toFormat = _interopDefault(require('toformat'));
var _Decimal = _interopDefault(require('decimal.js-light'));
var solidity = require('@ethersproject/solidity');
var ethers = require('ethers');
var contracts = require('@ethersproject/contracts');
var networks = require('@ethersproject/networks');
var providers = require('@ethersproject/providers');
var IDXswapPair = _interopDefault(require('dxswap-core/build/IDXswapPair.json'));
var IDXswapFactory = _interopDefault(require('dxswap-core/build/IDXswapFactory.json'));
var abi = require('@ethersproject/abi');
var fetch = _interopDefault(require('node-fetch'));

var PERMISSIVE_MULTICALL_ABI = [
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct PermissiveMulticall.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "aggregate",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				internalType: "bytes[]",
				name: "returnData",
				type: "bytes[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "target",
						type: "address"
					},
					{
						internalType: "bytes",
						name: "callData",
						type: "bytes"
					}
				],
				internalType: "struct PermissiveMulticall.Call[]",
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "aggregateWithPermissiveness",
		outputs: [
			{
				internalType: "uint256",
				name: "blockNumber",
				type: "uint256"
			},
			{
				components: [
					{
						internalType: "bool",
						name: "success",
						type: "bool"
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes"
					}
				],
				internalType: "struct PermissiveMulticall.CallOutcome[]",
				name: "callOutcomes",
				type: "tuple[]"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var stakingRewardsDistributionFactory = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_rewardTokensValidatorAddress",
				type: "address"
			},
			{
				internalType: "address",
				name: "_stakableTokenValidatorAddress",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "deployedAt",
				type: "address"
			}
		],
		name: "DistributionCreated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_rewardTokensAddresses",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "_stakableTokenAddress",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "_rewardAmounts",
				type: "uint256[]"
			},
			{
				internalType: "uint64",
				name: "_startingTimestamp",
				type: "uint64"
			},
			{
				internalType: "uint64",
				name: "_endingTimestmp",
				type: "uint64"
			},
			{
				internalType: "bool",
				name: "_locked",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "_stakingCap",
				type: "uint256"
			}
		],
		name: "createDistribution",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "distributions",
		outputs: [
			{
				internalType: "contract ERC20StakingRewardsDistribution",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getDistributionsAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "rewardTokensValidator",
		outputs: [
			{
				internalType: "contract IRewardTokensValidator",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_rewardTokensValidatorAddress",
				type: "address"
			}
		],
		name: "setRewardTokensValidator",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_stakableTokenValidatorAddress",
				type: "address"
			}
		],
		name: "setStakableTokenValidator",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakableTokenValidator",
		outputs: [
			{
				internalType: "contract IStakableTokenValidator",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var stakingRewardsDistribution = [
	{
		anonymous: false,
		inputs: [
		],
		name: "Canceled",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "claimer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		name: "Claimed",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address[]",
				name: "rewardsTokenAddresses",
				type: "address[]"
			},
			{
				indexed: false,
				internalType: "address",
				name: "stakableTokenAddress",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "rewardsAmounts",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "startingTimestamp",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "endingTimestamp",
				type: "uint64"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "locked",
				type: "bool"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "stakingCap",
				type: "uint256"
			}
		],
		name: "Initialized",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			}
		],
		name: "Recovered",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "staker",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Staked",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "withdrawer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "Withdrawn",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "claimedReward",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "consolidatedRewardsPerStakedToken",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "earnedRewards",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "endingTimestamp",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "initialized",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "lastConsolidationTimestamp",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "locked",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "recoverableUnassignedReward",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "rewardAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "rewardPerStakedToken",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "rewardTokens",
		outputs: [
			{
				internalType: "contract ERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "secondsDuration",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakableToken",
		outputs: [
			{
				internalType: "contract ERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "stakedTokenAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "stakedTokensOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stakingCap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "startingTimestamp",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "totalClaimedRewards",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalStakedTokensAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getRewardTokens",
		outputs: [
			{
				internalType: "contract ERC20[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_claimer",
				type: "address"
			}
		],
		name: "getClaimedRewards",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_rewardTokenAddresses",
				type: "address[]"
			},
			{
				internalType: "address",
				name: "_stakableTokenAddress",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "_rewardAmounts",
				type: "uint256[]"
			},
			{
				internalType: "uint64",
				name: "_startingTimestamp",
				type: "uint64"
			},
			{
				internalType: "uint64",
				name: "_endingTimestamp",
				type: "uint64"
			},
			{
				internalType: "bool",
				name: "_locked",
				type: "bool"
			},
			{
				internalType: "uint256",
				name: "_stakingCap",
				type: "uint256"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "cancel",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "recoverUnassignedRewards",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}
		],
		name: "stake",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256"
			}
		],
		name: "withdraw",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "_amounts",
				type: "uint256[]"
			},
			{
				internalType: "address",
				name: "_recipient",
				type: "address"
			}
		],
		name: "claim",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_recipient",
				type: "address"
			}
		],
		name: "claimAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_recipient",
				type: "address"
			}
		],
		name: "exit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "consolidateReward",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_staker",
				type: "address"
			}
		],
		name: "claimableRewards",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

var tokenRegistry = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "listId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "string",
				name: "listName",
				type: "string"
			}
		],
		name: "AddList",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "listId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "AddToken",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "listId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "RemoveToken",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_listName",
				type: "string"
			}
		],
		name: "addList",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_listId",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "_tokens",
				type: "address[]"
			}
		],
		name: "addTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_trader",
				type: "address"
			},
			{
				internalType: "address[]",
				name: "_assetAddresses",
				type: "address[]"
			}
		],
		name: "getExternalBalances",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_listId",
				type: "uint256"
			}
		],
		name: "getTokens",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_tokens",
				type: "address[]"
			}
		],
		name: "getTokensData",
		outputs: [
			{
				internalType: "string[]",
				name: "names",
				type: "string[]"
			},
			{
				internalType: "string[]",
				name: "symbols",
				type: "string[]"
			},
			{
				internalType: "uint256[]",
				name: "decimals",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_listId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_start",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_end",
				type: "uint256"
			}
		],
		name: "getTokensRange",
		outputs: [
			{
				internalType: "address[]",
				name: "tokensRange",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_listId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_token",
				type: "address"
			}
		],
		name: "isTokenActive",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "listCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_listId",
				type: "uint256"
			},
			{
				internalType: "address[]",
				name: "_tokens",
				type: "address[]"
			}
		],
		name: "removeTokens",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "tcrs",
		outputs: [
			{
				internalType: "uint256",
				name: "listId",
				type: "uint256"
			},
			{
				internalType: "string",
				name: "listName",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "activeTokenCount",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

var _FACTORY_ADDRESS, _ROUTER_ADDRESS, _STAKING_REWARDS_FACT, _TOKEN_REGISTRY_ADDRE, _DXSWAP_TOKEN_LIST_ID, _INIT_CODE_HASH, _SOLIDITY_TYPE_MAXIMA, _PERMISSIVE_MULTICALL;

(function (ChainId) {
  ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
  ChainId[ChainId["RINKEBY"] = 4] = "RINKEBY";
  ChainId[ChainId["ARBITRUM_TESTNET_V3"] = 79377087078960] = "ARBITRUM_TESTNET_V3";
  ChainId[ChainId["SOKOL"] = 77] = "SOKOL";
  ChainId[ChainId["XDAI"] = 100] = "XDAI";
  ChainId[ChainId["MATIC"] = 137] = "MATIC";
  ChainId[ChainId["TESTBSTC"] = 5005] = "TESTBSTC";
  ChainId[ChainId["BSTC"] = 7007] = "BSTC";
})(exports.ChainId || (exports.ChainId = {}));

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(exports.TradeType || (exports.TradeType = {}));

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(exports.Rounding || (exports.Rounding = {}));

var ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
var FACTORY_ADDRESS = (_FACTORY_ADDRESS = {}, _FACTORY_ADDRESS[exports.ChainId.MAINNET] = _contracts_json.mainnet.factory, _FACTORY_ADDRESS[exports.ChainId.RINKEBY] = _contracts_json.rinkeby.factory, _FACTORY_ADDRESS[exports.ChainId.ARBITRUM_TESTNET_V3] = _contracts_json.arbitrumTestnetV3.factory, _FACTORY_ADDRESS[exports.ChainId.SOKOL] = _contracts_json.sokol.factory, _FACTORY_ADDRESS[exports.ChainId.XDAI] = _contracts_json.xdai.factory, _FACTORY_ADDRESS[exports.ChainId.MATIC] = _contracts_json.matic.factory, _FACTORY_ADDRESS[exports.ChainId.TESTBSTC] = _contracts_json.testBSTC.factory, _FACTORY_ADDRESS[exports.ChainId.BSTC] = _contracts_json.BSTC.factory, _FACTORY_ADDRESS);
var ROUTER_ADDRESS = (_ROUTER_ADDRESS = {}, _ROUTER_ADDRESS[exports.ChainId.RINKEBY] = _contracts_json$1.rinkeby.router, _ROUTER_ADDRESS[exports.ChainId.MAINNET] = _contracts_json$1.mainnet.router, _ROUTER_ADDRESS[exports.ChainId.ARBITRUM_TESTNET_V3] = _contracts_json$1.arbitrumTestnetV3.router, _ROUTER_ADDRESS[exports.ChainId.SOKOL] = _contracts_json$1.sokol.router, _ROUTER_ADDRESS[exports.ChainId.XDAI] = _contracts_json$1.xdai.router, _ROUTER_ADDRESS[exports.ChainId.MATIC] = _contracts_json$1.matic.router, _ROUTER_ADDRESS[exports.ChainId.TESTBSTC] = _contracts_json$1.testBSTC.router, _ROUTER_ADDRESS[exports.ChainId.BSTC] = _contracts_json$1.BSTC.router, _ROUTER_ADDRESS);
var STAKING_REWARDS_FACTORY_ADDRESS = (_STAKING_REWARDS_FACT = {}, _STAKING_REWARDS_FACT[exports.ChainId.MAINNET] = '0x0000000000000000000000000000000000001234', _STAKING_REWARDS_FACT[exports.ChainId.RINKEBY] = '0xDcA39454f0B83c6f0807708b0E6a620dd9BA6808', _STAKING_REWARDS_FACT[exports.ChainId.ARBITRUM_TESTNET_V3] = '0xB95Ad562EDE8DD78BBFC287fA18150e802b09D9F', _STAKING_REWARDS_FACT[exports.ChainId.SOKOL] = '0xD436e756Cf41318ADeC62E8dCbEF2608753Ae068', _STAKING_REWARDS_FACT[exports.ChainId.XDAI] = '0xCD2A45F36464FdB1065160e03A2353996Ea8Ff57', _STAKING_REWARDS_FACT[exports.ChainId.MATIC] = '0x0000000000000000000000000000000000001234', _STAKING_REWARDS_FACT);
var TOKEN_REGISTRY_ADDRESS = (_TOKEN_REGISTRY_ADDRE = {}, _TOKEN_REGISTRY_ADDRE[exports.ChainId.MAINNET] = '0x93DB90445B76329e9ed96ECd74e76D8fbf2590d8', _TOKEN_REGISTRY_ADDRE[exports.ChainId.RINKEBY] = '0x815d1b18f6baaeb3853b0f637475a5c2b28e2253', _TOKEN_REGISTRY_ADDRE[exports.ChainId.ARBITRUM_TESTNET_V3] = '0x9d6f6d86b81289e40e07fcda805c06f6e9b8f629', _TOKEN_REGISTRY_ADDRE[exports.ChainId.SOKOL] = '0x681c3836a5589b933062ACA4fd846c1287a2865F', _TOKEN_REGISTRY_ADDRE[exports.ChainId.XDAI] = '0x85E001DfFF16F388Bc32Cd18009ceDF8F9b62C9E', _TOKEN_REGISTRY_ADDRE[exports.ChainId.MATIC] = '0x0000000000000000000000000000000000001234', _TOKEN_REGISTRY_ADDRE);
var DXSWAP_TOKEN_LIST_ID = (_DXSWAP_TOKEN_LIST_ID = {}, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.MAINNET] = 1, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.RINKEBY] = 1, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.ARBITRUM_TESTNET_V3] = 1, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.SOKOL] = 1, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.XDAI] = 5, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.MATIC] = 137, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.TESTBSTC] = 5005, _DXSWAP_TOKEN_LIST_ID[exports.ChainId.BSTC] = 7007, _DXSWAP_TOKEN_LIST_ID);
var INIT_CODE_HASH = (_INIT_CODE_HASH = {}, _INIT_CODE_HASH[exports.ChainId.MAINNET] = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776', _INIT_CODE_HASH[exports.ChainId.RINKEBY] = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776', _INIT_CODE_HASH[exports.ChainId.ARBITRUM_TESTNET_V3] = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776', _INIT_CODE_HASH[exports.ChainId.SOKOL] = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776', _INIT_CODE_HASH[exports.ChainId.XDAI] = '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93', _INIT_CODE_HASH[exports.ChainId.MATIC] = '0xae81bbc68f315fbbf7617eb881349af83b1e95241f616966e1e0583ecd0793fe', _INIT_CODE_HASH[exports.ChainId.TESTBSTC] = '0x63c52921df830fc505703646b11b5221d795993ba352f631679a51e92087ffcc', _INIT_CODE_HASH[exports.ChainId.BSTC] = '0x8a9a92045ce74057bcbb6bd831ca6cb0291c41b227fe790d31268fcc6f9159cc', _INIT_CODE_HASH);
var MINIMUM_LIQUIDITY = /*#__PURE__*/JSBI.BigInt(1000); // exports for internal consumption

var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var TWO = /*#__PURE__*/JSBI.BigInt(2);
var THREE = /*#__PURE__*/JSBI.BigInt(3);
var FIVE = /*#__PURE__*/JSBI.BigInt(5);
var TEN = /*#__PURE__*/JSBI.BigInt(10);
var _25 = /*#__PURE__*/JSBI.BigInt(25);
var SECONDS_IN_YEAR = /*#__PURE__*/JSBI.BigInt(31536000);
var _30 = /*#__PURE__*/JSBI.BigInt(30);
var _100 = /*#__PURE__*/JSBI.BigInt(100);
var _1000 = /*#__PURE__*/JSBI.BigInt(1000);
var _10000 = /*#__PURE__*/JSBI.BigInt(10000);
var defaultSwapFee = _25;
var defaultProtocolFeeDenominator = FIVE;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(exports.SolidityType || (exports.SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[exports.SolidityType.uint8] = /*#__PURE__*/JSBI.BigInt('0xff'), _SOLIDITY_TYPE_MAXIMA[exports.SolidityType.uint256] = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);
var PERMISSIVE_MULTICALL_ADDRESS = (_PERMISSIVE_MULTICALL = {}, _PERMISSIVE_MULTICALL[exports.ChainId.MAINNET] = '0x0946f567d0ed891e6566c1da8e5093517f43571d', _PERMISSIVE_MULTICALL[exports.ChainId.RINKEBY] = '0x798d8ced4dff8f054a5153762187e84751a73344', _PERMISSIVE_MULTICALL[exports.ChainId.ARBITRUM_TESTNET_V3] = '0x73a08DC74eF4ed2c360199244bb69F1464204E7C', _PERMISSIVE_MULTICALL[exports.ChainId.SOKOL] = '0x4D97Bd8eFaCf46b33c4438Ed0B7B6AABfa2359FB', _PERMISSIVE_MULTICALL[exports.ChainId.XDAI] = '0x4E75068ED2338fCa56631E740B0723A6dbc1d5CD', _PERMISSIVE_MULTICALL[exports.ChainId.MATIC] = '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E', _PERMISSIVE_MULTICALL);

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
} // warns if addresses are not checksummed

function validateAndParseAddress(address$1) {
  try {
    var checksummedAddress = address.getAddress(address$1); // warning(address === checksummedAddress, `${address} is not checksummed.`)

    return checksummedAddress;
  } catch (error) {
      invariant(false, address$1 + " is not a valid address.")  ;
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI ? bigintIsh : typeof bigintIsh === 'bigint' ? JSBI.BigInt(bigintIsh.toString()) : JSBI.BigInt(bigintIsh);
} // mock the on-chain sqrt function

function sqrt(y) {
  validateSolidityTypeInstance(y, exports.SolidityType.uint256);
  var z = ZERO;
  var x;

  if (JSBI.greaterThan(y, THREE)) {
    z = y;
    x = JSBI.add(JSBI.divide(y, TWO), ONE);

    while (JSBI.lessThan(x, z)) {
      z = x;
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO);
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE;
  }

  return z;
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ?  invariant(false, 'MAX_SIZE_ZERO')  : void 0; // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize) ?  invariant(false, 'ITEMS_SIZE')  : void 0; // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = ('setPrototypeOf' in Object);
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */

var InsufficientReservesError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(InsufficientReservesError, _Error);

  function InsufficientReservesError() {
    var _this;

    _this = _Error.call(this) || this;
    _this.isInsufficientReservesError = true;
    _this.name = _this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this), (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype);
    return _this;
  }

  return InsufficientReservesError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */

var InsufficientInputAmountError = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(InsufficientInputAmountError, _Error2);

  function InsufficientInputAmountError() {
    var _this2;

    _this2 = _Error2.call(this) || this;
    _this2.isInsufficientInputAmountError = true;
    _this2.name = _this2.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this2), (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype);
    return _this2;
  }

  return InsufficientInputAmountError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _Currency$NATIVE_CURR;
/**
 * A currency is any fungible financial instrument on the target chain.
 *
 * The only instances of the base class `Currency` are native currencies such as Ether for Ethereum,
 * SPOA for the Sokol testnet and xDAI for xDAI.
 */

var Currency = /*#__PURE__*/function () {
  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  function Currency(decimals, symbol, name) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), exports.SolidityType.uint8);
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }

  Currency.isNative = function isNative(currency) {
    return Object.values(Currency.NATIVE_CURRENCY).indexOf(currency) >= 0;
  };

  Currency.getNative = function getNative(chainId) {
    return Currency.NATIVE_CURRENCY[chainId];
  };

  return Currency;
}(); // fiat currencies used to represent countervalues

Currency.USD = /*#__PURE__*/new Currency(18, 'USD', 'US dollar'); // Native currencies for deployment chains

Currency.ETHER = /*#__PURE__*/new Currency(18, 'ETH', 'Ether');
Currency.SPOA = /*#__PURE__*/new Currency(18, 'SPOA', 'Sokol POA');
Currency.XDAI = /*#__PURE__*/new Currency(18, 'XDAI', 'xDAI');
Currency.MATIC = /*#__PURE__*/new Currency(18, 'MATIC', 'MATIC');
Currency.TESTBSTC = /*#__PURE__*/new Currency(18, 'TESTBSTC', 'TESTBSTC');
Currency.BSTC = /*#__PURE__*/new Currency(18, 'BSTC', 'BSTC');
Currency.NATIVE_CURRENCY = (_Currency$NATIVE_CURR = {}, _Currency$NATIVE_CURR[exports.ChainId.MAINNET] = Currency.ETHER, _Currency$NATIVE_CURR[exports.ChainId.RINKEBY] = Currency.ETHER, _Currency$NATIVE_CURR[exports.ChainId.ARBITRUM_TESTNET_V3] = Currency.ETHER, _Currency$NATIVE_CURR[exports.ChainId.SOKOL] = Currency.SPOA, _Currency$NATIVE_CURR[exports.ChainId.XDAI] = Currency.XDAI, _Currency$NATIVE_CURR[exports.ChainId.MATIC] = Currency.MATIC, _Currency$NATIVE_CURR[exports.ChainId.TESTBSTC] = Currency.TESTBSTC, _Currency$NATIVE_CURR[exports.ChainId.BSTC] = Currency.BSTC, _Currency$NATIVE_CURR);
var USD = Currency.USD;
var ETHER = Currency.ETHER;
var SPOA = Currency.SPOA;
var XDAI = Currency.XDAI;
var MATIC = Currency.MATIC;
var TESTBSTC = Currency.TESTBSTC;
var BSTC = Currency.BSTC;

var _Token$WETH, _Token$WSPOA, _Token$WXDAI, _Token$WMATIC, _Token$DXD, _Token$NATIVE_CURRENC;
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/function (_Currency) {
  _inheritsLoose(Token, _Currency);

  function Token(chainId, address, decimals, symbol, name) {
    var _this;

    _this = _Currency.call(this, decimals, symbol, name) || this;
    _this.chainId = chainId;
    _this.address = validateAndParseAddress(address);
    return _this;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */


  var _proto = Token.prototype;

  _proto.equals = function equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true;
    }

    return this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  ;

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(this.address !== other.address) ?  invariant(false, 'ADDRESSES')  : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  };

  Token.getNativeWrapper = function getNativeWrapper(chainId) {
    return Token.NATIVE_CURRENCY_WRAPPER[chainId];
  };

  Token.isNativeWrapper = function isNativeWrapper(token) {
    return Token.NATIVE_CURRENCY_WRAPPER[token.chainId].equals(token);
  };

  return Token;
}(Currency);
Token.WETH = (_Token$WETH = {}, _Token$WETH[exports.ChainId.MAINNET] = /*#__PURE__*/new Token(exports.ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'), _Token$WETH[exports.ChainId.RINKEBY] = /*#__PURE__*/new Token(exports.ChainId.RINKEBY, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'), _Token$WETH[exports.ChainId.ARBITRUM_TESTNET_V3] = /*#__PURE__*/new Token(exports.ChainId.ARBITRUM_TESTNET_V3, '0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b', 18, 'WETH', 'Wrapped Ether'), _Token$WETH[exports.ChainId.SOKOL] = /*#__PURE__*/new Token(exports.ChainId.SOKOL, '0xfDc50eF6b67F65Dddc36e56729a9D07BAe1A1f68', 18, 'WETH', 'Wrapped Ether'), _Token$WETH[exports.ChainId.XDAI] = /*#__PURE__*/new Token(exports.ChainId.XDAI, '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1', 18, 'WETH', 'Wrapped Ether on xDai'), _Token$WETH[exports.ChainId.MATIC] = /*#__PURE__*/new Token(exports.ChainId.MATIC, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 18, 'WETH', 'Wrapped Ether on Matic'), _Token$WETH[exports.ChainId.TESTBSTC] = /*#__PURE__*/new Token(exports.ChainId.MATIC, '0x923EE6A3da838640b49B1FA648e5e26994BFbBc1', 18, 'WETH', 'Wrapped Ether on TestBSTC'), _Token$WETH[exports.ChainId.BSTC] = /*#__PURE__*/new Token(exports.ChainId.BSTC, '0x73F379B9089825180C16f6dA7716944f835e33E8', 18, 'WETH', 'Wrapped Ether on BSTC'), _Token$WETH);
Token.WSPOA = (_Token$WSPOA = {}, _Token$WSPOA[exports.ChainId.SOKOL] = /*#__PURE__*/new Token(exports.ChainId.SOKOL, '0xc655c6D80ac92d75fBF4F40e95280aEb855B1E87', 18, 'WSPOA', 'Wrapped SPOA'), _Token$WSPOA);
Token.WXDAI = (_Token$WXDAI = {}, _Token$WXDAI[exports.ChainId.XDAI] = /*#__PURE__*/new Token(exports.ChainId.XDAI, '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', 18, 'WXDAI', 'Wrapped xDAI'), _Token$WXDAI);
Token.WMATIC = (_Token$WMATIC = {}, _Token$WMATIC[exports.ChainId.MATIC] = /*#__PURE__*/new Token(exports.ChainId.MATIC, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic'), _Token$WMATIC);
Token.DXD = (_Token$DXD = {}, _Token$DXD[exports.ChainId.MAINNET] = /*#__PURE__*/new Token(exports.ChainId.MAINNET, '0xa1d65E8fB6e87b60FECCBc582F7f97804B725521', 18, 'DXD', 'DXdao'), _Token$DXD[exports.ChainId.RINKEBY] = /*#__PURE__*/new Token(exports.ChainId.RINKEBY, '0x554898A0BF98aB0C03ff86C7DccBE29269cc4d29', 18, 'DXD', 'DXdao'), _Token$DXD[exports.ChainId.XDAI] = /*#__PURE__*/new Token(exports.ChainId.XDAI, '0xb90d6bec20993be5d72a5ab353343f7a0281f158', 18, 'DXD', 'DXdao from Ethereum'), _Token$DXD);
Token.NATIVE_CURRENCY_WRAPPER = (_Token$NATIVE_CURRENC = {}, _Token$NATIVE_CURRENC[exports.ChainId.MAINNET] = Token.WETH[exports.ChainId.MAINNET], _Token$NATIVE_CURRENC[exports.ChainId.RINKEBY] = Token.WETH[exports.ChainId.RINKEBY], _Token$NATIVE_CURRENC[exports.ChainId.ARBITRUM_TESTNET_V3] = Token.WETH[exports.ChainId.ARBITRUM_TESTNET_V3], _Token$NATIVE_CURRENC[exports.ChainId.SOKOL] = Token.WSPOA[exports.ChainId.SOKOL], _Token$NATIVE_CURRENC[exports.ChainId.XDAI] = Token.WXDAI[exports.ChainId.XDAI], _Token$NATIVE_CURRENC[exports.ChainId.MATIC] = Token.WMATIC[exports.ChainId.MATIC], _Token$NATIVE_CURRENC[exports.ChainId.TESTBSTC] = Token.WMATIC[exports.ChainId.TESTBSTC], _Token$NATIVE_CURRENC[exports.ChainId.BSTC] = Token.WETH[exports.ChainId.BSTC], _Token$NATIVE_CURRENC);
/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof Token) {
    return false;
  } else if (currencyB instanceof Token) {
    return false;
  } else {
    return currencyA === currencyB;
  }
} // reexport for convenience

var WETH = Token.WETH;
var WSPOA = Token.WSPOA;
var DXD = Token.DXD;
var WXDAI = Token.WXDAI;
var WMATIC = Token.WMATIC;

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[exports.Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[exports.Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[exports.Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[exports.Rounding.ROUND_DOWN] = 0, _toFixedRounding[exports.Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[exports.Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = ONE;
    }

    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  } // performs floor division


  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ?  invariant(false, significantDigits + " is not an integer.")  : void 0;
    !(significantDigits > 0) ?  invariant(false, significantDigits + " is not positive.")  : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ?  invariant(false, decimalPlaces + " is not an integer.")  : void 0;
    !(decimalPlaces >= 0) ?  invariant(false, decimalPlaces + " is negative.")  : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  };

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }]);

  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  // amount _must_ be raw, i.e. in the native representation
  function CurrencyAmount(currency, amount) {
    var _this;

    var parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, exports.SolidityType.uint256);
    _this = _Fraction.call(this, parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals))) || this;
    _this.currency = currency;
    return _this;
  }
  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */


  CurrencyAmount.nativeCurrency = function nativeCurrency(amount, chainId) {
    var nativeCurrency = Currency.getNative(chainId);
    !!!nativeCurrency ?  invariant(false, 'NO_NATIVE_CURRENCY')  : void 0;
    return new CurrencyAmount(nativeCurrency, amount);
  }
  /**
   * Helper that calls the constructor with the USD currency
   * @param amount amount of usd experessed in wei (with 18 decimals resolution)
   */
  ;

  CurrencyAmount.usd = function usd(amount) {
    return new CurrencyAmount(USD, amount);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !currencyEquals(this.currency, other.currency) ?  invariant(false, 'TOKEN')  : void 0;
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !currencyEquals(this.currency, other.currency) ?  invariant(false, 'TOKEN')  : void 0;
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ?  invariant(false, 'DECIMALS')  : void 0;
    return _Fraction.prototype.toFixed.call(this, decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    Big$1.DP = this.currency.decimals;
    return new Big$1(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
  };

  _createClass(CurrencyAmount, [{
    key: "raw",
    get: function get() {
      return this.numerator;
    }
  }]);

  return CurrencyAmount;
}(Fraction);

var TokenAmount = /*#__PURE__*/function (_CurrencyAmount) {
  _inheritsLoose(TokenAmount, _CurrencyAmount);

  // amount _must_ be raw, i.e. in the native representation
  function TokenAmount(token, amount) {
    var _this;

    _this = _CurrencyAmount.call(this, token, amount) || this;
    _this.token = token;
    return _this;
  }

  var _proto = TokenAmount.prototype;

  _proto.add = function add(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw));
  };

  return TokenAmount;
}(CurrencyAmount);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  // denominator and numerator _must_ be raw, i.e. in the native representation
  function Price(baseCurrency, quoteCurrency, denominator, numerator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(JSBI.exponentiate(TEN, JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(TEN, JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }

  Price.fromRoute = function fromRoute(route) {
    var prices = [];

    for (var _iterator = _createForOfIteratorHelperLoose(route.pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      prices.push(route.path[i].equals(pair.token0) ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw) : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw));
    }

    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  };

  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  };

  _proto.multiply = function multiply(other) {
    !currencyEquals(this.quoteCurrency, other.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  } // performs floor division on overflow
  ;

  _proto.quote = function quote(currencyAmount) {
    !currencyEquals(currencyAmount.currency, this.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;

    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, _Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient);
    }

    return CurrencyAmount.nativeCurrency(_Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient, exports.ChainId.MAINNET);
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    return this.adjusted.toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }

    return this.adjusted.toFixed(decimalPlaces, format, rounding);
  };

  _createClass(Price, [{
    key: "raw",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }, {
    key: "adjusted",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);

  return Price;
}(Fraction);

var _RoutablePlatform, _RoutablePlatform2, _RoutablePlatform3, _RoutablePlatform4, _RoutablePlatform5, _RoutablePlatform6, _RoutablePlatform7, _RoutablePlatform8, _RoutablePlatform9, _RoutablePlatform10, _RoutablePlatform11, _RoutablePlatform12, _RoutablePlatform13, _RoutablePlatform14, _RoutablePlatform15;
var UNISWAP_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
var SUSHISWAP_FACTORY_ADDRESS = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac';
var SUSHISWAP_MATIC_FACTORY_ADDRESS = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';
var SWAPR_FACTORY_ADDRESS = '0x5D48C95AdfFD4B40c1AAADc4e08fc44117E02179';
var BAOSWAP_FACTORY_ADDRESS = '0x45de240fbe2077dd3e711299538a09854fae9c9b';
var QUICKSWAP_FACTORY_ADDRESS = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';
var SUSHISWAP_XDAI_FACTORY_ADDRESS = '0xc35DADB65012eC5796536bD9864eD8773aBc74C4';
var UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
var SUSHISWAP_ROUTER_ADDRESS = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';
var SUSHISWAP_MATIC_ROUTER_ADDRESS = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
var SWAPR_ROUTER_ADDRESS = '0xE43e60736b1cb4a75ad25240E2f9a62Bff65c0C0';
var BAOSWAP_ROUTER_ADDRESS = '0x6093AeBAC87d62b1A5a4cEec91204e35020E38bE';
var QUICKSWAP_ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';
var SUSHISWAP_XDAI_ROUTER_ADDRESS = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506';
/**
 * A platform to which Swapr can route through.
 */

var RoutablePlatform = /*#__PURE__*/function () {
  function RoutablePlatform(name, factoryAddress, routerAddress, initCodeHash, defaultSwapFee) {
    this.name = name;
    this.factoryAddress = factoryAddress;
    this.routerAddress = routerAddress;
    this.initCodeHash = initCodeHash;
    this.defaultSwapFee = defaultSwapFee;
  }

  var _proto = RoutablePlatform.prototype;

  _proto.supportsChain = function supportsChain(chainId) {
    return !!this.factoryAddress[chainId];
  };

  return RoutablePlatform;
}();
RoutablePlatform.HONEYSWAP = /*#__PURE__*/new RoutablePlatform('Bstcswap', FACTORY_ADDRESS, ROUTER_ADDRESS, INIT_CODE_HASH, _30);
RoutablePlatform.TESTBSTCSWAP = /*#__PURE__*/new RoutablePlatform('TESTBSTCSWAP', FACTORY_ADDRESS, ROUTER_ADDRESS, INIT_CODE_HASH, _30);
RoutablePlatform.UNISWAP = /*#__PURE__*/new RoutablePlatform('Uniswap', (_RoutablePlatform = {}, _RoutablePlatform[exports.ChainId.MAINNET] = UNISWAP_FACTORY_ADDRESS, _RoutablePlatform[exports.ChainId.RINKEBY] = UNISWAP_FACTORY_ADDRESS, _RoutablePlatform), (_RoutablePlatform2 = {}, _RoutablePlatform2[exports.ChainId.MAINNET] = UNISWAP_ROUTER_ADDRESS, _RoutablePlatform2[exports.ChainId.RINKEBY] = UNISWAP_ROUTER_ADDRESS, _RoutablePlatform2), (_RoutablePlatform3 = {}, _RoutablePlatform3[exports.ChainId.MAINNET] = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f', _RoutablePlatform3), _30);
RoutablePlatform.SUSHISWAP = /*#__PURE__*/new RoutablePlatform('Sushiswap', (_RoutablePlatform4 = {}, _RoutablePlatform4[exports.ChainId.MAINNET] = SUSHISWAP_FACTORY_ADDRESS, _RoutablePlatform4[exports.ChainId.RINKEBY] = SUSHISWAP_FACTORY_ADDRESS, _RoutablePlatform4[exports.ChainId.MATIC] = SUSHISWAP_MATIC_FACTORY_ADDRESS, _RoutablePlatform4[exports.ChainId.XDAI] = SUSHISWAP_XDAI_FACTORY_ADDRESS, _RoutablePlatform4), (_RoutablePlatform5 = {}, _RoutablePlatform5[exports.ChainId.MAINNET] = SUSHISWAP_ROUTER_ADDRESS, _RoutablePlatform5[exports.ChainId.RINKEBY] = SUSHISWAP_ROUTER_ADDRESS, _RoutablePlatform5[exports.ChainId.MATIC] = SUSHISWAP_MATIC_ROUTER_ADDRESS, _RoutablePlatform5[exports.ChainId.XDAI] = SUSHISWAP_XDAI_ROUTER_ADDRESS, _RoutablePlatform5), (_RoutablePlatform6 = {}, _RoutablePlatform6[exports.ChainId.MAINNET] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _RoutablePlatform6[exports.ChainId.MATIC] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _RoutablePlatform6[exports.ChainId.XDAI] = '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303', _RoutablePlatform6), _30);
RoutablePlatform.SWAPR = /*#__PURE__*/new RoutablePlatform('Swapr', (_RoutablePlatform7 = {}, _RoutablePlatform7[exports.ChainId.XDAI] = SWAPR_FACTORY_ADDRESS, _RoutablePlatform7), (_RoutablePlatform8 = {}, _RoutablePlatform8[exports.ChainId.XDAI] = SWAPR_ROUTER_ADDRESS, _RoutablePlatform8), (_RoutablePlatform9 = {}, _RoutablePlatform9[exports.ChainId.XDAI] = '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776', _RoutablePlatform9), _30);
RoutablePlatform.BAOSWAP = /*#__PURE__*/new RoutablePlatform('Baoswap', (_RoutablePlatform10 = {}, _RoutablePlatform10[exports.ChainId.XDAI] = BAOSWAP_FACTORY_ADDRESS, _RoutablePlatform10), (_RoutablePlatform11 = {}, _RoutablePlatform11[exports.ChainId.XDAI] = BAOSWAP_ROUTER_ADDRESS, _RoutablePlatform11), (_RoutablePlatform12 = {}, _RoutablePlatform12[exports.ChainId.XDAI] = '0x0bae3ead48c325ce433426d2e8e6b07dac10835baec21e163760682ea3d3520d', _RoutablePlatform12), _30);
RoutablePlatform.QUICKSWAP = /*#__PURE__*/new RoutablePlatform('Quickswap', (_RoutablePlatform13 = {}, _RoutablePlatform13[exports.ChainId.MATIC] = QUICKSWAP_FACTORY_ADDRESS, _RoutablePlatform13), (_RoutablePlatform14 = {}, _RoutablePlatform14[exports.ChainId.MATIC] = QUICKSWAP_ROUTER_ADDRESS, _RoutablePlatform14), (_RoutablePlatform15 = {}, _RoutablePlatform15[exports.ChainId.MATIC] = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f', _RoutablePlatform15), _30);

var _INITIAL_CACHE_STATE, _PAIR_ADDRESS_CACHE;
var INITIAL_CACHE_STATE = (_INITIAL_CACHE_STATE = {}, _INITIAL_CACHE_STATE[exports.ChainId.MAINNET] = {}, _INITIAL_CACHE_STATE[exports.ChainId.RINKEBY] = {}, _INITIAL_CACHE_STATE[exports.ChainId.ARBITRUM_TESTNET_V3] = {}, _INITIAL_CACHE_STATE[exports.ChainId.SOKOL] = {}, _INITIAL_CACHE_STATE[exports.ChainId.XDAI] = {}, _INITIAL_CACHE_STATE[exports.ChainId.MATIC] = {}, _INITIAL_CACHE_STATE[exports.ChainId.BSTC] = {}, _INITIAL_CACHE_STATE);
var PAIR_ADDRESS_CACHE = (_PAIR_ADDRESS_CACHE = {}, _PAIR_ADDRESS_CACHE[RoutablePlatform.SWAPR.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE[RoutablePlatform.SUSHISWAP.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE[RoutablePlatform.UNISWAP.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE[RoutablePlatform.HONEYSWAP.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE[RoutablePlatform.BAOSWAP.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE[RoutablePlatform.QUICKSWAP.name] = /*#__PURE__*/_extends({}, INITIAL_CACHE_STATE), _PAIR_ADDRESS_CACHE);
var Pair = /*#__PURE__*/function () {
  function Pair(tokenAmountA, tokenAmountB, swapFee, protocolFeeDenominator, platform, liquidityMiningCampaigns) {
    if (platform === void 0) {
      platform = RoutablePlatform.HONEYSWAP;
    }

    if (liquidityMiningCampaigns === void 0) {
      liquidityMiningCampaigns = [];
    }

    this.swapFee = defaultSwapFee;
    this.protocolFeeDenominator = defaultProtocolFeeDenominator;
    !(tokenAmountA.token.chainId === tokenAmountB.token.chainId) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.platform = platform ? platform : RoutablePlatform.HONEYSWAP;
    var liquidityTokenAddress = Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token, platform);
    this.liquidityToken = new Token(tokenAmounts[0].token.chainId, liquidityTokenAddress, 18, 'TBSTCS', 'TestBSTCSwap');
    this.protocolFeeDenominator = protocolFeeDenominator ? protocolFeeDenominator : defaultProtocolFeeDenominator;
    this.tokenAmounts = tokenAmounts;
    this.swapFee = swapFee ? swapFee : platform.defaultSwapFee;
    this.liquidityMiningCampaigns = liquidityMiningCampaigns;
  }
  /**
   * Returns true if the two pairs are equivalent, i.e. have the same address (calculated using create2).
   * @param other other pair to compare
   */


  var _proto = Pair.prototype;

  _proto.equals = function equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true;
    }

    return this.liquidityToken.address === other.liquidityToken.address;
  };

  Pair.getAddress = function getAddress(tokenA, tokenB, platform) {
    var _PAIR_ADDRESS_CACHE2, _PAIR_ADDRESS_CACHE2$, _PAIR_ADDRESS_CACHE2$2, _PAIR_ADDRESS_CACHE2$3;

    if (platform === void 0) {
      platform = RoutablePlatform.HONEYSWAP;
    }

    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

    var chainId = tokenA.chainId;
    !platform.supportsChain(chainId) ?  invariant(false, 'INVALID_PLATFORM_CHAIN_ID')  : void 0;

    if (((_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE2 === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE2$ = _PAIR_ADDRESS_CACHE2[platform.name]) === null || _PAIR_ADDRESS_CACHE2$ === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE2$2 = _PAIR_ADDRESS_CACHE2$[chainId]) === null || _PAIR_ADDRESS_CACHE2$2 === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE2$3 = _PAIR_ADDRESS_CACHE2$2[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE2$3 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE2$3[tokens[1].address]) === undefined) {
      var _PAIR_ADDRESS_CACHE3, _PAIR_ADDRESS_CACHE3$, _PAIR_ADDRESS_CACHE3$2, _extends2, _extends3, _extends4, _extends5;

      PAIR_ADDRESS_CACHE = _extends({}, PAIR_ADDRESS_CACHE, (_extends5 = {}, _extends5[platform.name] = _extends({}, PAIR_ADDRESS_CACHE[platform.name], (_extends4 = {}, _extends4[chainId] = _extends({}, PAIR_ADDRESS_CACHE[platform.name][chainId], (_extends3 = {}, _extends3[tokens[0].address] = _extends({}, (_PAIR_ADDRESS_CACHE3 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE3 === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE3$ = _PAIR_ADDRESS_CACHE3[platform.name]) === null || _PAIR_ADDRESS_CACHE3$ === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE3$2 = _PAIR_ADDRESS_CACHE3$[chainId]) === null || _PAIR_ADDRESS_CACHE3$2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE3$2[tokens[0].address], (_extends2 = {}, _extends2[tokens[1].address] = address.getCreate2Address(platform.factoryAddress[chainId], solidity.keccak256(['bytes'], [solidity.pack(['address', 'address'], [tokens[0].address, tokens[1].address])]), platform.initCodeHash[chainId]), _extends2)), _extends3)), _extends4)), _extends5));
    }

    return PAIR_ADDRESS_CACHE[platform.name][chainId][tokens[0].address][tokens[1].address];
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.raw, JSBI.subtract(_10000, parseBigintIsh(this.swapFee)));
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.raw, _10000), inputAmountWithFee);
    var outputAmount = new TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.swapFee, this.protocolFeeDenominator)];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO) || JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), _10000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), JSBI.subtract(_10000, parseBigintIsh(this.swapFee)));
    var inputAmount = new TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.swapFee, this.protocolFeeDenominator)];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = parseBigintIsh(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        var rootKLast = sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, parseBigintIsh(this.protocolFeeDenominator)), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
  };

  _createClass(Pair, [{
    key: "token0Price",
    get: function get() {
      return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

var Route = /*#__PURE__*/function () {
  function Route(pairs, input, output) {
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !pairs.every(function (pair) {
      return pair.chainId === pairs[0].chainId;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !pairs.every(function (pair) {
      return pair.platform === pairs[0].platform;
    }) ?  invariant(false, 'PLATFORM')  : void 0;
    !(input instanceof Token && pairs[0].involvesToken(input) || Currency.isNative(input) && pairs[0].involvesToken(Token.getNativeWrapper(pairs[0].chainId))) ?  invariant(false, 'INPUT')  : void 0;
    !(typeof output === 'undefined' || output instanceof Token && pairs[pairs.length - 1].involvesToken(output) || Currency.isNative(output) && pairs[pairs.length - 1].involvesToken(Token.getNativeWrapper(pairs[0].chainId))) ?  invariant(false, 'OUTPUT')  : void 0;
    var path = [input instanceof Token ? input : Token.getNativeWrapper(pairs[0].chainId)];

    for (var _iterator = _createForOfIteratorHelperLoose(pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pair.token0) || currentInput.equals(pair.token1)) ?  invariant(false, 'PATH')  : void 0;

      var _output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;

      path.push(_output);
    }

    this.pairs = pairs;
    this.path = path;
    this.midPrice = Price.fromRoute(this);
    this.input = input;
    this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pairs[0].chainId;
    }
  }]);

  return Route;
}();

var _100_PERCENT = /*#__PURE__*/new Fraction(_100);

var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);

  function Percent() {
    return _Fraction.apply(this, arguments) || this;
  }

  var _proto = Percent.prototype;

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }

    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }

    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding);
  };

  return Percent;
}(Fraction);

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw); // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
} // comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first


function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */

function wrappedAmount(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount) return currencyAmount;
  if (Currency.isNative(currencyAmount.currency)) return new TokenAmount(Token.getNativeWrapper(chainId), currencyAmount.raw);
    invariant(false, 'CURRENCY')  ;
}

function wrappedCurrency(currency, chainId) {
  if (currency instanceof Token) return currency;
  if (Currency.isNative(currency)) return Token.getNativeWrapper(chainId);
    invariant(false, 'CURRENCY')  ;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */


var Trade = /*#__PURE__*/function () {
  function Trade(route, amount, tradeType) {
    this.chainId = route.chainId;
    var amounts = new Array(route.path.length);
    var nextPairs = new Array(route.pairs.length);

    if (tradeType === exports.TradeType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input) ?  invariant(false, 'INPUT')  : void 0;
      amounts[0] = wrappedAmount(amount, route.chainId);

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i];

        var _pair$getOutputAmount = pair.getOutputAmount(amounts[i]),
            outputAmount = _pair$getOutputAmount[0],
            nextPair = _pair$getOutputAmount[1];

        amounts[i + 1] = outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      !currencyEquals(amount.currency, route.output) ?  invariant(false, 'OUTPUT')  : void 0;
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1];

        var _pair$getInputAmount = _pair.getInputAmount(amounts[_i]),
            inputAmount = _pair$getInputAmount[0],
            _nextPair = _pair$getInputAmount[1];

        amounts[_i - 1] = inputAmount;
        nextPairs[_i - 1] = _nextPair;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    this.inputAmount = tradeType === exports.TradeType.EXACT_INPUT ? amount : Currency.isNative(route.input) ? CurrencyAmount.nativeCurrency(amounts[0].raw, this.chainId) : amounts[0];
    this.outputAmount = tradeType === exports.TradeType.EXACT_OUTPUT ? amount : Currency.isNative(route.output) ? CurrencyAmount.nativeCurrency(amounts[amounts.length - 1].raw, this.chainId) : amounts[amounts.length - 1];
    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw);
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input));
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
    this.platform = this.route.pairs[0].platform;
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  Trade.exactIn = function exactIn(route, amountIn) {
    return new Trade(route, amountIn, exports.TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  Trade.exactOut = function exactOut(route, amountOut) {
    return new Trade(route, amountOut, exports.TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.nativeCurrency(slippageAdjustedAmountOut, this.chainId);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.nativeCurrency(slippageAdjustedAmountIn, this.chainId);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactIn = function bestTradeExactIn(pairs, currencyAmountIn, currencyOut, _temp, // used in recursion.
  currentPairs, originalAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$maxNumResults = _ref.maxNumResults,
        maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
        _ref$maxHops = _ref.maxHops,
        maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = currencyAmountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountIn === currencyAmountIn || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountIn instanceof TokenAmount ? currencyAmountIn.token.chainId : currencyOut instanceof Token ? currencyOut.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var amountIn = wrappedAmount(currencyAmountIn, chainId);
    var tokenOut = wrappedCurrency(currencyOut, chainId);

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0;

      try {
        ;

        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn);

        amountOut = _pair$getOutputAmount2[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(bestTrades, new Trade(new Route([].concat(currentPairs, [pair]), originalAmountIn.currency, currencyOut), originalAmountIn, exports.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        Trade.bestTradeExactIn(pairsExcludingThisPair, amountOut, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentPairs, [pair]), originalAmountIn, bestTrades);
      }
    }

    return bestTrades;
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactOut = function bestTradeExactOut(pairs, currencyIn, currencyAmountOut, _temp2, // used in recursion.
  currentPairs, originalAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$maxNumResults = _ref2.maxNumResults,
        maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
        _ref2$maxHops = _ref2.maxHops,
        maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = currencyAmountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountOut === currencyAmountOut || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountOut instanceof TokenAmount ? currencyAmountOut.token.chainId : currencyIn instanceof Token ? currencyIn.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var amountOut = wrappedAmount(currencyAmountOut, chainId);
    var tokenIn = wrappedCurrency(currencyIn, chainId);

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;

      try {
        ;

        var _pair$getInputAmount2 = pair.getInputAmount(amountOut);

        amountIn = _pair$getInputAmount2[0];
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(bestTrades, new Trade(new Route([pair].concat(currentPairs), currencyIn, originalAmountOut.currency), originalAmountOut, exports.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, amountIn, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [pair].concat(currentPairs), originalAmountOut, bestTrades);
      }
    }

    return bestTrades;
  };

  return Trade;
}();

var PricedTokenAmount = /*#__PURE__*/function (_TokenAmount) {
  _inheritsLoose(PricedTokenAmount, _TokenAmount);

  // amount _must_ be raw, i.e. in the native representation
  function PricedTokenAmount(token, amount) {
    var _this;

    _this = _TokenAmount.call(this, token, amount) || this;
    _this.token = token;
    return _this;
  }

  _createClass(PricedTokenAmount, [{
    key: "nativeCurrencyAmount",
    get: function get() {
      return new CurrencyAmount(this.token.price.quoteCurrency, ethers.utils.parseUnits(this.multiply(this.token.price).toFixed(this.token.price.quoteCurrency.decimals), this.token.price.quoteCurrency.decimals).toString());
    }
  }]);

  return PricedTokenAmount;
}(TokenAmount);

var _MINIMUM_STAKED_AMOUN;

var MINIMUM_STAKED_AMOUNT_NATIVE_CURRENCY = (_MINIMUM_STAKED_AMOUN = {}, _MINIMUM_STAKED_AMOUN[exports.ChainId.RINKEBY] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('0.05', Token.getNative(exports.ChainId.RINKEBY).decimals).toString(), exports.ChainId.RINKEBY), _MINIMUM_STAKED_AMOUN[exports.ChainId.MAINNET] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('0.1', Token.getNative(exports.ChainId.MAINNET).decimals).toString(), exports.ChainId.MAINNET), _MINIMUM_STAKED_AMOUN[exports.ChainId.XDAI] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('1000', Token.getNative(exports.ChainId.XDAI).decimals).toString(), exports.ChainId.XDAI), _MINIMUM_STAKED_AMOUN[exports.ChainId.SOKOL] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('1000', Token.getNative(exports.ChainId.SOKOL).decimals).toString(), exports.ChainId.SOKOL), _MINIMUM_STAKED_AMOUN[exports.ChainId.ARBITRUM_TESTNET_V3] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('0.05', Token.getNative(exports.ChainId.ARBITRUM_TESTNET_V3).decimals).toString(), exports.ChainId.ARBITRUM_TESTNET_V3), _MINIMUM_STAKED_AMOUN[exports.ChainId.MATIC] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('1000', Token.getNative(exports.ChainId.MATIC).decimals).toString(), exports.ChainId.MATIC), _MINIMUM_STAKED_AMOUN[exports.ChainId.TESTBSTC] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('1000', Token.getNative(exports.ChainId.TESTBSTC).decimals).toString(), exports.ChainId.TESTBSTC), _MINIMUM_STAKED_AMOUN[exports.ChainId.BSTC] = /*#__PURE__*/CurrencyAmount.nativeCurrency( /*#__PURE__*/ethers.utils.parseUnits('1000', Token.getNative(exports.ChainId.BSTC).decimals).toString(), exports.ChainId.TESTBSTC), _MINIMUM_STAKED_AMOUN);
var LiquidityMiningCampaign = /*#__PURE__*/function () {
  function LiquidityMiningCampaign(startsAt, endsAt, targetedPair, rewards, staked, locked, stakingCap, address) {
    !JSBI.lessThan(parseBigintIsh(startsAt), parseBigintIsh(endsAt)) ?  invariant(false, 'INCONSISTENT_DATES')  : void 0;
    !staked.token.equals(targetedPair.liquidityToken) ?  invariant(false, 'STAKED_LP_TOKEN')  : void 0;

    for (var _iterator = _createForOfIteratorHelperLoose(rewards), _step; !(_step = _iterator()).done;) {
      var reward = _step.value;
      !(staked.token.chainId === reward.token.chainId) ?  invariant(false, 'CHAIN_ID')  : void 0;
    }

    this.chainId = staked.token.chainId;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.rewards = rewards;
    this.targetedPair = targetedPair;
    this.staked = staked;
    this.duration = JSBI.subtract(parseBigintIsh(endsAt), parseBigintIsh(startsAt));
    this.locked = locked;
    this.stakingCap = stakingCap;
    this.address = address;
  }

  _createClass(LiquidityMiningCampaign, [{
    key: "remainingDistributionPercentage",
    get: function get() {
      var now = JSBI.BigInt(Math.floor(Date.now() / 1000));
      var jsbiStartsAt = parseBigintIsh(this.startsAt);
      var jsbiEndsAt = parseBigintIsh(this.endsAt);
      if (JSBI.lessThan(now, jsbiStartsAt)) return new Percent('100', '100');
      if (JSBI.greaterThanOrEqual(now, jsbiEndsAt)) return new Percent('0', '100');
      return new Percent(JSBI.subtract(jsbiEndsAt, now), this.duration);
    }
  }, {
    key: "remainingRewards",
    get: function get() {
      var remainingDistributionPercentage = this.remainingDistributionPercentage;
      return this.rewards.map(function (reward) {
        return new PricedTokenAmount(reward.token, remainingDistributionPercentage.multiply(reward.raw).toFixed(0));
      });
    }
  }, {
    key: "apy",
    get: function get() {
      var remainingRewards = this.remainingRewards;
      var stakedValueNativeCurrency = this.staked.nativeCurrencyAmount;

      if (stakedValueNativeCurrency.lessThan(MINIMUM_STAKED_AMOUNT_NATIVE_CURRENCY[this.chainId])) {
        stakedValueNativeCurrency = MINIMUM_STAKED_AMOUNT_NATIVE_CURRENCY[this.chainId];
      }

      var cumulativeRemainingRewardAmountNativeCurrency = remainingRewards.reduce(function (accumulator, remainingRewardAmount) {
        return accumulator.add(remainingRewardAmount.nativeCurrencyAmount);
      }, CurrencyAmount.nativeCurrency('0', this.chainId));
      var yieldInPeriod = cumulativeRemainingRewardAmountNativeCurrency.divide(stakedValueNativeCurrency);
      var annualizationMultiplier = new Fraction(SECONDS_IN_YEAR.toString(), this.duration.toString());
      var rawApy = yieldInPeriod.multiply(annualizationMultiplier);
      return new Percent(rawApy.numerator, rawApy.denominator);
    }
  }, {
    key: "currentlyActive",
    get: function get() {
      var now = JSBI.BigInt(Math.floor(Date.now() / 1000));
      return JSBI.lessThanOrEqual(parseBigintIsh(this.startsAt), now) && JSBI.greaterThan(parseBigintIsh(this.endsAt), now);
    }
  }, {
    key: "ended",
    get: function get() {
      return JSBI.greaterThan(JSBI.BigInt(Math.floor(Date.now() / 1000)), parseBigintIsh(this.endsAt));
    }
  }]);

  return LiquidityMiningCampaign;
}();

/**
 * Represents an ERC20 token and its price, expressed in any given currency.
 */

var PricedToken = /*#__PURE__*/function (_Token) {
  _inheritsLoose(PricedToken, _Token);

  function PricedToken(chainId, address, decimals, price, symbol, name) {
    var _this;

    !(price.baseCurrency.symbol === symbol && price.baseCurrency.decimals === decimals) ?  invariant(false, 'TOKEN')  : void 0;
    _this = _Token.call(this, chainId, address, decimals, symbol, name) || this;
    _this.price = price;
    return _this;
  }

  return PricedToken;
}(Token);

function toHex(currencyAmount) {
  return "0x" + currencyAmount.raw.toString(16);
}

var ZERO_HEX = '0x0';
/**
 * Represents the Uniswap V2 Router, and has static methods for helping execute trades.
 */

var Router = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Router() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  Router.swapCallParameters = function swapCallParameters(trade, options) {
    var nativeCurrency = Currency.getNative(trade.chainId);
    var etherIn = trade.inputAmount.currency === nativeCurrency;
    var etherOut = trade.outputAmount.currency === nativeCurrency; // the router does not support both ether in and out

    !!(etherIn && etherOut) ?  invariant(false, 'ETHER_IN_OUT')  : void 0;
    !(!('ttl' in options) || options.ttl > 0) ?  invariant(false, 'TTL')  : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    var path = trade.route.path.map(function (token) {
      return token.address;
    });
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);
    var useFeeOnTransfer = Boolean(options.feeOnTransfer);
    var methodName;
    var args;
    var value;

    switch (trade.tradeType) {
      case exports.TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'; // (uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }

        break;

      case exports.TradeType.EXACT_OUTPUT:
        !!useFeeOnTransfer ?  invariant(false, 'EXACT_OUT_FOT')  : void 0;

        if (etherIn) {
          methodName = 'swapETHForExactTokens'; // (uint amountOut, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = 'swapTokensForExactETH'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = 'swapTokensForExactTokens'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }

        break;
    }

    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };

  return Router;
}();

var ERC20Abi = [
	{
		constant: true,
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
		],
		name: "name",
		outputs: [
			{
				name: "",
				type: "string"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

var _TOKEN_DATA_CACHE, _TOKEN_LOGO_URI_CACHE;
var TOKEN_DATA_CACHE = (_TOKEN_DATA_CACHE = {}, _TOKEN_DATA_CACHE[exports.ChainId.MAINNET] = {
  '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': {
    decimals: 9,
    symbol: 'DGD',
    name: 'DigixDAO'
  } // DGD

}, _TOKEN_DATA_CACHE);
var TOKEN_LOGO_URI_CACHE = (_TOKEN_LOGO_URI_CACHE = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.MAINNET] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.XDAI] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.SOKOL] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.ARBITRUM_TESTNET_V3] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.RINKEBY] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.MATIC] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.TESTBSTC] = {}, _TOKEN_LOGO_URI_CACHE[exports.ChainId.BSTC] = {}, _TOKEN_LOGO_URI_CACHE);
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */

var Fetcher = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Fetcher() {}
  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   */


  Fetcher.fetchTokenData = function fetchTokenData(chainId, address, provider) {
    try {
      var _temp3 = function _temp3() {
        return new Token(chainId, address, tokenData.decimals, tokenData.symbol, tokenData.name);
      };

      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));
      var tokenData;

      var _temp4 = function () {
        var _TOKEN_DATA_CACHE$cha;

        if (TOKEN_DATA_CACHE !== null && TOKEN_DATA_CACHE !== void 0 && (_TOKEN_DATA_CACHE$cha = TOKEN_DATA_CACHE[chainId]) !== null && _TOKEN_DATA_CACHE$cha !== void 0 && _TOKEN_DATA_CACHE$cha[address]) {
          tokenData = TOKEN_DATA_CACHE[chainId][address];
        } else {
          var multicall = new contracts.Contract(PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI, provider);
          var erc20Interface = new contracts.Contract(address, ERC20Abi, provider)["interface"];
          var symbolFunction = erc20Interface.getFunction('symbol()');
          var nameFunction = erc20Interface.getFunction('name()');
          var decimalsFunction = erc20Interface.getFunction('decimals()');
          return Promise.resolve(multicall.aggregate([[address, erc20Interface.encodeFunctionData(symbolFunction)], [address, erc20Interface.encodeFunctionData(nameFunction)], [address, erc20Interface.encodeFunctionData(decimalsFunction)]])).then(function (result) {
            tokenData = {
              symbol: erc20Interface.decodeFunctionResult(symbolFunction, result.returnData[0])[0],
              name: erc20Interface.decodeFunctionResult(nameFunction, result.returnData[1])[0],
              decimals: erc20Interface.decodeFunctionResult(decimalsFunction, result.returnData[2])[0]
            };
            TOKEN_DATA_CACHE[chainId][address] = tokenData;
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetch on-chain, information on multiple given ERC20 token addresses, using the given ethers provider
   * (or a default one if not provided). The results are cached for efficient subsequent accesses.
   * @param chainId chain of the token
   * @param addresses addresses of the tokens for which the data is needed
   * @param provider provider used to fetch the token
   */
  ;

  Fetcher.fetchMultipleTokensData = function fetchMultipleTokensData(chainId, addresses, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));

      var _addresses$reduce = addresses.reduce(function (accumulator, address, _currentIndex, _array) {
        var _TOKEN_DATA_CACHE$cha2;

        if (TOKEN_DATA_CACHE !== null && TOKEN_DATA_CACHE !== void 0 && (_TOKEN_DATA_CACHE$cha2 = TOKEN_DATA_CACHE[chainId]) !== null && _TOKEN_DATA_CACHE$cha2 !== void 0 && _TOKEN_DATA_CACHE$cha2[address]) {
          var cachedToken = TOKEN_DATA_CACHE[chainId][address];
          accumulator.previouslyCachedTokens.push(new Token(chainId, address, cachedToken.decimals, cachedToken.symbol, cachedToken.name));
        } else {
          accumulator.missingTokens.push(address);
        }

        return accumulator;
      }, {
        previouslyCachedTokens: [],
        missingTokens: []
      }),
          previouslyCachedTokens = _addresses$reduce.previouslyCachedTokens,
          missingTokens = _addresses$reduce.missingTokens;

      var tokenData = previouslyCachedTokens;

      var _temp6 = function () {
        if (missingTokens.length > 0) {
          var erc20Interface = new abi.Interface(ERC20Abi);
          var getSymbolFunction = erc20Interface.getFunction('symbol()');
          var getNameFunction = erc20Interface.getFunction('name()');
          var getDecimalsFunction = erc20Interface.getFunction('decimals()');
          var multicall = new contracts.Contract(PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI, provider);
          var aggregatedCalls = missingTokens.reduce(function (accumulator, address, _currentIndex, _array) {
            accumulator.push([address, erc20Interface.encodeFunctionData(getSymbolFunction)]);
            accumulator.push([address, erc20Interface.encodeFunctionData(getNameFunction)]);
            accumulator.push([address, erc20Interface.encodeFunctionData(getDecimalsFunction)]);
            return accumulator;
          }, []);
          return Promise.resolve(multicall.aggregateWithPermissiveness(aggregatedCalls)).then(function (result) {
            var returnData = result[1];
            missingTokens.forEach(function (address, index) {
              var _returnData$slice = returnData.slice(index * 3, index * 3 + 3),
                  wrappedSymbol = _returnData$slice[0],
                  wrappedName = _returnData$slice[1],
                  wrappedDecimals = _returnData$slice[2];

              if (!wrappedSymbol.success || !wrappedName.success || !wrappedDecimals.success) {
                console.warn("could not fetch ERC20 data for address " + address);
                return;
              }

              try {
                tokenData.push(new Token(chainId, address, erc20Interface.decodeFunctionResult(getDecimalsFunction, wrappedDecimals.data)[0], erc20Interface.decodeFunctionResult(getSymbolFunction, wrappedSymbol.data)[0], erc20Interface.decodeFunctionResult(getNameFunction, wrappedName.data)[0]));
              } catch (error) {
                console.error("error decoding ERC20 data for address " + address);
              }
            });
          });
        }
      }();

      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {
        return tokenData;
      }) : tokenData);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches information about a pair and constructs a pair from the given two tokens.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchPairData = function fetchPairData(tokenA, tokenB, provider, platform) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(tokenA.chainId));
      if (platform === undefined) platform = RoutablePlatform.HONEYSWAP;
      !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
      var address = Pair.getAddress(tokenA, tokenB, platform);
      return Promise.resolve(new contracts.Contract(address, IDXswapPair.abi, provider).getReserves()).then(function (_ref) {
        var reserves0 = _ref[0],
            reserves1 = _ref[1];
        var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
        var tokenAmountA = new TokenAmount(tokenA, balances[0]);
        var tokenAmountB = new TokenAmount(tokenB, balances[1]);
        var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
        ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
        var liquidityToken = new Token(tokenAmounts[0].token.chainId, Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token, platform), 18, 'DXS', 'DXswap');
        var _BigInt = JSBI.BigInt;
        return Promise.resolve(new contracts.Contract(liquidityToken.address, IDXswapPair.abi, provider).swapFee()).then(function (_Contract$swapFee) {
          var swapFee = _BigInt.call(JSBI, _Contract$swapFee);

          var _BigInt2 = JSBI.BigInt;
          return Promise.resolve(new contracts.Contract(FACTORY_ADDRESS[tokenAmountA.token.chainId], IDXswapFactory.abi, provider).protocolFeeDenominator()).then(function (_Contract$protocolFee) {
            var protocolFeeDenominator = _BigInt2.call(JSBI, _Contract$protocolFee);

            return new Pair(tokenAmountA, tokenAmountB, swapFee, protocolFeeDenominator);
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches swap fee information from a liquidity token of a token pair
   * @param liquidityToken the liquidity token from which the swap fee info will be fetched
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchSwapFee = function fetchSwapFee(liquidityToken, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(liquidityToken.chainId));
      var _BigInt4 = JSBI.BigInt;
      return Promise.resolve(new contracts.Contract(liquidityToken.address, IDXswapPair.abi, provider).swapFee()).then(function (_Contract$swapFee2) {
        var _BigInt3$call = _BigInt4.call(JSBI, _Contract$swapFee2);

        return Promise.resolve(new contracts.Contract(FACTORY_ADDRESS[liquidityToken.chainId], IDXswapFactory.abi, provider).feeToSetter()).then(function (_Contract$feeToSetter) {
          return {
            fee: _BigInt3$call,
            owner: _Contract$feeToSetter
          };
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches swap fee information from liquidity tokens of token pairs
   * @param liquidityToken the liquidity tokens from which the swap fee info will be fetched
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchSwapFees = function fetchSwapFees(liquidityTokens, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(liquidityTokens[0].chainId));
      var multicall = new contracts.Contract(PERMISSIVE_MULTICALL_ADDRESS[liquidityTokens[0].chainId], PERMISSIVE_MULTICALL_ABI, provider);
      var factoryContract = new contracts.Contract(FACTORY_ADDRESS[liquidityTokens[0].chainId], IDXswapFactory.abi, provider);
      var liquidityTokenContract = new contracts.Contract(liquidityTokens[0].address, IDXswapPair.abi, provider);
      var calls = [];
      calls.push({
        address: factoryContract.address,
        callData: factoryContract["interface"].encodeFunctionData(factoryContract["interface"].getFunction('feeToSetter()'))
      });

      for (var tokenPairsIndex = 0; tokenPairsIndex < liquidityTokens.length; tokenPairsIndex++) {
        calls.push({
          address: liquidityTokens[tokenPairsIndex].address,
          callData: liquidityTokenContract["interface"].encodeFunctionData(liquidityTokenContract["interface"].getFunction('swapFee()'))
        });
      }

      return Promise.resolve(multicall.aggregate(calls.map(function (call) {
        return [call.address, call.callData];
      }))).then(function (result) {
        var owner = factoryContract["interface"].decodeFunctionResult(factoryContract["interface"].getFunction('feeToSetter()'), result.returnData[0])[0];
        var fees = [];

        for (var resultIndex = 1; resultIndex < result.returnData.length; resultIndex++) {
          fees.push({
            fee: JSBI.BigInt(liquidityTokenContract["interface"].decodeFunctionResult(liquidityTokenContract["interface"].getFunction('swapFee()'), result.returnData[resultIndex])[0]),
            owner: owner
          });
        }

        return fees;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches swap fee information of all registered token pairs from factory
   * @param chainId the chainId of the network to fecth the swap fees
   * @param swapFeesCache a cache of already fetched fees to be skiped
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchAllSwapFees = function fetchAllSwapFees(chainId, swapFeesCache, provider) {
    if (swapFeesCache === void 0) {
      swapFeesCache = {};
    }

    try {
      var _this2 = this;

      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));
      var multicall = new contracts.Contract(PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI, provider);
      var factoryContract = new contracts.Contract(FACTORY_ADDRESS[chainId], IDXswapFactory.abi, provider);
      return Promise.resolve(factoryContract.allPairsLength()).then(function (allPairsLength) {
        var allSwapPairs = {}; // Get first token pairs from cache

        var tokenPairsCache = Object.keys(swapFeesCache);
        var tokenPairsToFetch = [];

        for (var tokenPaisCacheIndex = 0; tokenPaisCacheIndex < tokenPairsCache.length; tokenPaisCacheIndex++) {
          allSwapPairs[tokenPairsCache[tokenPaisCacheIndex]] = {
            fee: swapFeesCache[tokenPairsCache[tokenPaisCacheIndex]].fee,
            owner: swapFeesCache[tokenPairsCache[tokenPaisCacheIndex]].owner
          };
        } // Get rest of the token pairs that are not cached


        var calls = [];

        for (var pairIndex = tokenPairsCache.length; pairIndex < allPairsLength; pairIndex++) {
          calls.push({
            address: factoryContract.address,
            callData: factoryContract["interface"].encodeFunctionData(factoryContract["interface"].getFunction('allPairs(uint)'), [pairIndex])
          });
        }

        return Promise.resolve(multicall.aggregate(calls.map(function (call) {
          return [call.address, call.callData];
        }))).then(function (result) {
          for (var resultIndex = 0; resultIndex < result.returnData.length; resultIndex++) {
            var tokenPairAddress = factoryContract["interface"].decodeFunctionResult(factoryContract["interface"].getFunction('allPairs(uint256)'), result.returnData[resultIndex])[0];
            tokenPairsToFetch.push(new Token(chainId, tokenPairAddress, 18, 'DXS', 'DXswap'));
          } // Fetch the pairs that we dont have the fee and owner


          return Promise.resolve(_this2.fetchSwapFees(tokenPairsToFetch, provider)).then(function (swapFeesFetched) {
            for (var tokenPairsToFetchIndex = 0; tokenPairsToFetchIndex < tokenPairsToFetch.length; tokenPairsToFetchIndex++) {
              allSwapPairs[tokenPairsToFetch[tokenPairsToFetchIndex].address] = swapFeesFetched[tokenPairsToFetchIndex];
            }

            return allSwapPairs;
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches protocol fee information from the token pair factory
   * @param chainId the chainId of the network to fecth the protocol fee
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchProtocolFee = function fetchProtocolFee(chainId, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));
      return Promise.resolve(new contracts.Contract(FACTORY_ADDRESS[chainId], IDXswapFactory.abi, provider)).then(function (factoryContract) {
        return Promise.resolve(factoryContract.protocolFeeDenominator()).then(function (feeDenominator) {
          return Promise.resolve(factoryContract.feeTo()).then(function (feeReceiver) {
            return {
              feeDenominator: feeDenominator,
              feeReceiver: feeReceiver
            };
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches the default DXdao token list from the token registry scheme.
   * @param chainId the chainId of the network to fecth the protocol fee
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchDxDaoTokenList = function fetchDxDaoTokenList(chainId) {
    try {
      var _tokenListUrl$get;

      var _this4 = this;

      var tokenListUrl = new Map([[1, 'https://tokens.coingecko.com/uniswap/all.json'], [100, 'https://tokens.honeyswap.org'], [137, 'https://tokens.honeyswap.org'], [5005, 'https://tokens.coingecko.com/uniswap/all.json'], [7007, 'https://tokens.coingecko.com/uniswap/all.json']]); // const tokenRegistryContract = new Contract(TOKEN_REGISTRY_ADDRESS[chainId], TokenRegistryAbi, provider)
      // const tokenAddresses = await tokenRegistryContract.getTokens(DXSWAP_TOKEN_LIST_ID[chainId])
      // const tokens = await this.fetchMultipleTokensData(chainId, tokenAddresses, provider)

      var chainTokenURL = (_tokenListUrl$get = tokenListUrl.get(chainId)) !== null && _tokenListUrl$get !== void 0 ? _tokenListUrl$get : '';
      return Promise.resolve(fetch(chainTokenURL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      })).then(function (response) {
        var tokenList = [];
        return response.ok ? Promise.resolve(response.json()).then(function (_ref2) {
          var tokens = _ref2.tokens;

          function _temp8() {
            for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
              var token = _step.value;

              if (token.chainId === chainId) {
                tokenList.push({
                  chainId: chainId,
                  address: token.address,
                  name: token.name,
                  decimals: token.decimals,
                  symbol: token.symbol,
                  logoURI: token.logoURI
                });
              }
            }

            return {
              name: 'swapr default token list',
              tokens: tokenList
            };
          }

          var _temp7 = function () {
            if (tokens.length != 0) {
              return Promise.resolve(_this4.fetchTokenLogoUri(chainId, tokens)).then(function () {});
            }
          }();

          return _temp7 && _temp7.then ? _temp7.then(_temp8) : _temp8(_temp7);
        }) : {
          name: 'default token list',
          tokens: []
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Fetcher.fetchTokenLogoUri = function fetchTokenLogoUri(tokenChainId, tokens) {
    try {
      var _this6 = this;

      var _chainId = tokenChainId;

      if (_chainId !== exports.ChainId.MAINNET && _chainId !== exports.ChainId.XDAI && _chainId !== exports.ChainId.MATIC) {
        return Promise.resolve(); // token logos not fully supported for testnets
      }

      var _temp10 = function () {
        if (Object.keys(TOKEN_LOGO_URI_CACHE[_chainId]).length === 0) {
          return Promise.resolve(_this6.populateTokenLogoCache(_chainId, tokens)).then(function () {});
        }
      }();

      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Fetcher.checkTokenLogoCache = function checkTokenLogoCache(chainId) {
    try {
      var _exit2 = false;

      var _this8 = this;

      if (chainId !== exports.ChainId.MAINNET && chainId !== exports.ChainId.XDAI && chainId !== exports.ChainId.MATIC) {
        return Promise.resolve(); // token logos not fully supported for testnets
      }

      return Promise.resolve(function () {
        if (Object.keys(TOKEN_LOGO_URI_CACHE[chainId]).length === 0) {
          // populate cache
          return Promise.resolve(_this8.fetchDxDaoTokenList(chainId)).then(function () {
            _exit2 = true;
          });
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Fetcher.populateTokenLogoCache = function populateTokenLogoCache(chainId, tokens) {
    try {
      TOKEN_LOGO_URI_CACHE[chainId] = tokens.reduce(function (cache, token) {
        cache[token.address.toLowerCase()] = token.logoURI;
        return cache;
      }, {});
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Fetcher.getCachedTokenLogo = function getCachedTokenLogo(token) {
    var chainId = token.chainId;

    if (chainId !== exports.ChainId.MAINNET && chainId !== exports.ChainId.XDAI && chainId !== exports.ChainId.MATIC) {
      return '';
    }

    return TOKEN_LOGO_URI_CACHE[chainId][token.address.toLowerCase()] || '';
  };

  return Fetcher;
}();

exports.JSBI = JSBI;
exports.BSTC = BSTC;
exports.Currency = Currency;
exports.CurrencyAmount = CurrencyAmount;
exports.DXD = DXD;
exports.DXSWAP_TOKEN_LIST_ID = DXSWAP_TOKEN_LIST_ID;
exports.ETHER = ETHER;
exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.FIVE = FIVE;
exports.Fetcher = Fetcher;
exports.Fraction = Fraction;
exports.INIT_CODE_HASH = INIT_CODE_HASH;
exports.InsufficientInputAmountError = InsufficientInputAmountError;
exports.InsufficientReservesError = InsufficientReservesError;
exports.LiquidityMiningCampaign = LiquidityMiningCampaign;
exports.MATIC = MATIC;
exports.MINIMUM_LIQUIDITY = MINIMUM_LIQUIDITY;
exports.ONE = ONE;
exports.PERMISSIVE_MULTICALL_ABI = PERMISSIVE_MULTICALL_ABI;
exports.PERMISSIVE_MULTICALL_ADDRESS = PERMISSIVE_MULTICALL_ADDRESS;
exports.Pair = Pair;
exports.Percent = Percent;
exports.Price = Price;
exports.PricedToken = PricedToken;
exports.PricedTokenAmount = PricedTokenAmount;
exports.ROUTER_ADDRESS = ROUTER_ADDRESS;
exports.RoutablePlatform = RoutablePlatform;
exports.Route = Route;
exports.Router = Router;
exports.SECONDS_IN_YEAR = SECONDS_IN_YEAR;
exports.SOLIDITY_TYPE_MAXIMA = SOLIDITY_TYPE_MAXIMA;
exports.SPOA = SPOA;
exports.STAKING_REWARDS_DISTRIBUTION_ABI = stakingRewardsDistribution;
exports.STAKING_REWARDS_FACTORY_ABI = stakingRewardsDistributionFactory;
exports.STAKING_REWARDS_FACTORY_ADDRESS = STAKING_REWARDS_FACTORY_ADDRESS;
exports.TEN = TEN;
exports.TESTBSTC = TESTBSTC;
exports.THREE = THREE;
exports.TOKEN_REGISTRY_ABI = tokenRegistry;
exports.TOKEN_REGISTRY_ADDRESS = TOKEN_REGISTRY_ADDRESS;
exports.TWO = TWO;
exports.Token = Token;
exports.TokenAmount = TokenAmount;
exports.Trade = Trade;
exports.USD = USD;
exports.WETH = WETH;
exports.WMATIC = WMATIC;
exports.WSPOA = WSPOA;
exports.WXDAI = WXDAI;
exports.XDAI = XDAI;
exports.ZERO = ZERO;
exports.ZERO_ADDRESS = ZERO_ADDRESS;
exports._100 = _100;
exports._1000 = _1000;
exports._10000 = _10000;
exports._25 = _25;
exports._30 = _30;
exports.currencyEquals = currencyEquals;
exports.defaultProtocolFeeDenominator = defaultProtocolFeeDenominator;
exports.defaultSwapFee = defaultSwapFee;
exports.inputOutputComparator = inputOutputComparator;
exports.parseBigintIsh = parseBigintIsh;
exports.tradeComparator = tradeComparator;
//# sourceMappingURL=dxswap-sdk.cjs.development.js.map
