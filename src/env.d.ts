/// <reference types="@rsbuild/core/types" />
import '@tanstack/react-router';

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
