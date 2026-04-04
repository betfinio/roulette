import type { Address } from 'viem';

export const CORE_ADDRESS: Address = import.meta.env.PUBLIC_CORE_ADDRESS;
export const SINGLE_PLAYER_GAME: Address = import.meta.env.PUBLIC_SINGLE_PLAYER_GAME_ADDRESS;
export const SINGLE_PLAYER_STRATEGY: Address = import.meta.env.PUBLIC_SINGLE_PLAYER_STRATEGY_ADDRESS;
export const MULTIPLAYER_GAME: Address = import.meta.env.PUBLIC_MULTIPLAYER_GAME_ADDRESS;
export const MULTIPLAYER_INTERVAL: number = Number(import.meta.env.PUBLIC_MULTIPLAYER_INTERVAL ?? 300);
export const ETHSCAN = import.meta.env.PUBLIC_ETHSCAN;
export const DYNAMIC_STAKING: Address = import.meta.env.PUBLIC_LIQUIDITY_POOL_ADDRESS;
export const ROULETTE_TUTORIAL = 'https://betfin.gitbook.io/betfin-public/games-manual/games-guide/roulette';
