/// <reference types="@rsbuild/core/types" />
import '@tanstack/react-router';
import type { router } from './bootstrap';

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
