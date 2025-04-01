import { sharedLang } from 'betfinio_context/translations';
import type { i18n } from 'i18next';
import * as i18 from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';
import csJSON from './translations/cs/roulette.json';
import enJSON from './translations/en/roulette.json';
import ruJSON from './translations/ru/roulette.json';

export const defaultNS = 'roulette';
export const resources = {
	en: {
		roulette: enJSON,
		shared: sharedLang.en,
	},
	ru: {
		roulette: ruJSON,
		shared: sharedLang.ru,
	},
	cs: {
		roulette: csJSON,
		shared: sharedLang.cs,
	},
} as const;

const instance: i18n = i18.createInstance();
instance
	.use(initReactI18next)
	.use(I18nextBrowserLanguageDetector)
	.use(ICU)
	.init({
		resources: resources,
		detection: {
			order: ['localStorage', 'navigator'],
			convertDetectedLanguage: (lng) => lng.split('-')[0],
		},
		supportedLngs: ['en', 'ru', 'cs'],
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
		react: { useSuspense: true },
	});

export default instance;
