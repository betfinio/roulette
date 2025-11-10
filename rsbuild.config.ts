import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import moduleFederationConfig from './module-federation.config';

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
	},
	performance: {
		chunkSplit: {
			strategy: 'split-by-module',
		},
	},
	plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig, {})],
	tools: {
		rspack: {
			ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
			plugins: [TanStackRouterRspack()],
		},
	},
});
