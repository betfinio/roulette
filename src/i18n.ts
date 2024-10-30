import type { i18n } from 'i18next';
import * as i18 from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';
import czJSON from './translations/cz/roulette.json';
import enJSON from './translations/en/roulette.json';
import ruJSON from './translations/ru/roulette.json';
export const defaultNS = 'roulette';
import { sharedLang } from 'betfinio_app/locales/index';

export const resources = {
	en: {
		roulette: enJSON,
		shared: sharedLang.en,
	},
	ru: {
		roulette: ruJSON,
		shared: sharedLang.ru,
	},
	cz: {
		roulette: czJSON,
		shared: sharedLang.cz,
	},
} as const;

const instance: i18n = i18.createInstance();
instance
	.use(initReactI18next)
	.use(ICU)
	.init({
		resources: resources,
		lng: 'en', // default language
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		react: { useSuspense: true },
	});

export default instance;
