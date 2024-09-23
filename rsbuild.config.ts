import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { dependencies } from './package.json';

const getApp = () => {
	return `betfinio_app@${process.env.PUBLIC_APP_URL}/mf-manifest.json`;
};

function getOutput() {
	return process.env.PUBLIC_OUTPUT_URL;
}

export default defineConfig({
	server: {
		port: 4001,
	},
	dev: {
		assetPrefix: 'http://localhost:4001',
	},
	html: {
		title: 'BetFin Roulette',
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
