import { createRouter, RouterProvider } from '@tanstack/react-router';
import { queryClient, wagmiConfig } from 'betfinio_context/config';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import './globals.css';

export const router = createRouter({
	routeTree,
	context: {
		wagmiConfig,
		queryClient,
	},
});

// Render the app
const rootElement = document.getElementById('root');
if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<RouterProvider router={router} />);
}
