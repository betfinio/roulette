import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import moduleFederationConfig from './module-federation.config';
import { pluginManifest } from './scripts/plugin-fetch-manifest';

const PORT = 4003;

export default defineConfig({
	server: {
		port: PORT,
		cors: {
			origin: '*',
		},
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
		filenameHash: false,
		injectStyles: true,
	},
	plugins: [
		pluginReact(),
		pluginModuleFederation(moduleFederationConfig, {}),
		pluginManifest({
			remoteName: 'betfinio_context',
			manifestUrl: process.env.PUBLIC_CONTEXT_URL || '',
			outputDir: '@mf-types/source',
		}),
	],
	tools: {
		rspack: {
			ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
			plugins: [TanStackRouterRspack()],
		},
	},
});
