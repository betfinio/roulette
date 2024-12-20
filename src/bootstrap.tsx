import './globals.css';
import '@betfinio/components';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { queryClient, wagmiConfig } from 'betfinio_app/config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
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
