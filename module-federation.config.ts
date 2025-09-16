import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

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
	dts: {
		consumeTypes: {
			typesOnBuild: true,
		},
	},
	shared: ['react', 'react-dom', '@tanstack/react-query', 'i18next', 'react-i18next', 'wagmi', '@tanstack/react-router', '@tanstack/react-store'],
});
