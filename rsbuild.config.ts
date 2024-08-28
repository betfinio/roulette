import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { dependencies } from './package.json';

const getApp = () => {
	switch (process.env.PUBLIC_ENVIRONMENT) {
		case 'development':
			return 'betfinio_app@https://app.betfin.dev/mf-manifest.json';
		case 'production':
			return 'betfinio_app@https://app.betfin.io/mf-manifest.json';
		case 'production-ua':
			return 'betfinio_app@https://app.betfin.gg/mf-manifest.json';
		default:
			return 'betfinio_app@http://localhost:5555/mf-manifest.json';
	}
};

function getOutput() {
	switch (process.env.PUBLIC_ENVIRONMENT) {
		case 'development':
			return 'https://template.betfin.dev';
		case 'production':
			return 'https://template.betfin.io';
		case 'production-ua':
			return 'https://template.betfin.gg';
		default:
			return 'http://localhost:4000';
	}
}

export default defineConfig({
	server: {
		port: 4000,
	},
	dev: {
		assetPrefix: 'http://localhost:4000',
	},
	html: {
		title: 'BetFin Games',
		favicon: './src/assets/favicon.svg',
	},
	output: {
		assetPrefix: getOutput(),
	},
	plugins: [pluginReact()],
	tools: {
		rspack: {
			output: {
				uniqueName: 'betfinio_games',
			},
			plugins: [
				TanStackRouterRspack(),
				new ModuleFederationPlugin({
					name: 'betfinio_games',
					remotes: {
						betfinio_app: getApp(),
					},
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
						'lucide-react': {
							singleton: true,
							requiredVersion: dependencies['lucide-react'],
						},
						i18next: {
							singleton: true,
							requiredVersion: dependencies.i18next,
						},
						'react-i18next': {
							singleton: true,
							requiredVersion: dependencies['react-i18next'],
						},
						'tailwindcss-animate': {
							singleton: true,
							requiredVersion: dependencies['tailwindcss-animate'],
						},
						tailwindcss: {
							singleton: true,
							requiredVersion: dependencies.tailwindcss,
						},
						wagmi: {
							singleton: true,
							requiredVersion: dependencies.wagmi,
						},
					},
				}),
			],
		},
	},
});
