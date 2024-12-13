import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { dependencies } from './package.json';

const PORT = 4003;

export default defineConfig({
	server: {
		port: PORT,
	},
	dev: {
		assetPrefix: `http://localhost:${PORT}`,
	},
	html: {
		title: 'Betfin Roulette',
		favicon: './src/assets/favicon.svg',
	},
	output: {
		assetPrefix: process.env.PUBLIC_OUTPUT_URL,
	},
	plugins: [
		pluginReact(),
		pluginModuleFederation({
			name: 'betfinio_roulette',
			remotes: {
				betfinio_app: `betfinio_app@${process.env.PUBLIC_APP_URL}/mf-manifest.json`,
			},
			manifest: false,
			dts: false,
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
		}),
	],
	tools: {
		rspack: {
			ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
			output: {
				uniqueName: 'betfinio_roulette',
			},
			plugins: [TanStackRouterRspack()],
		},
	},
});
