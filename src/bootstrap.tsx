import './globals.css';
import 'betfinio_app/style';
import '@betfinio/components';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { queryClient, wagmiConfig } from 'betfinio_app/config';
import { routeTree } from './routeTree.gen';

const router = createRouter({
	routeTree,
	context: {
		wagmiConfig,
		queryClient,
	},
});

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} basepath={'/games'} />);
}
