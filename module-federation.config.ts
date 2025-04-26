import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import { dependencies } from './package.json';

export default createModuleFederationConfig({
	name: 'betfinio_roulette',
	remotes: {
		betfinio_context: `betfinio_context@${process.env.PUBLIC_CONTEXT_URL}/mf-manifest.json`,
	},
	exposes: {
		'./route/single': './src/routes/games/roulette/single/index',
		'./route/live/table': './src/routes/games/roulette/live/$table',
		'./route/live/index': './src/routes/games/roulette/live/index',
		'./i18n': './src/i18n',
		'./style': './src/style',
	},
	manifest: true,
	dts: true,
	shared: {
		react: {
			singleton: true,
			requiredVersion: dependencies.react,
		},
		'react-dom': {
			singleton: true,
			requiredVersion: dependencies['react-dom'],
		},
		'@tanstack/react-router': {
			singleton: true,
			requiredVersion: dependencies['@tanstack/react-router'],
		},
		'@tanstack/react-query': {
			singleton: true,
			requiredVersion: dependencies['@tanstack/react-query'],
		},
		i18next: {
			singleton: true,
			requiredVersion: dependencies.i18next,
		},
		'react-i18next': {
			singleton: true,
			requiredVersion: dependencies['react-i18next'],
		},
		wagmi: {
			singleton: true,
			requiredVersion: dependencies.wagmi,
		},
	},
});
