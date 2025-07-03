import type { Address } from 'viem';

export const DYNAMIC_STAKING: Address = import.meta.env.PUBLIC_DYNAMIC_STAKING_ADDRESS;
export const PARTNER: Address = import.meta.env.PUBLIC_PARTNER_ADDRESS;
export const ETHSCAN = import.meta.env.PUBLIC_ETHSCAN;
export const ENVIRONMENT = import.meta.env.PUBLIC_ENVIRONMENT;
export const PUBLIC_LIRO_ADDRESS: Address = import.meta.env.PUBLIC_LIRO_ADDRESS;
export const ROULETTE_TUTORIAL = 'https://betfin.gitbook.io/betfin-public/games-manual/games-guide/roulette';

export const IS_DEV = ENVIRONMENT === 'development';
