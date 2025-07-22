import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import MockRoot from 'betfinio_context/components/MockRoot';
import type { queryClient, wagmiConfig } from 'betfinio_context/config';
import { GlobalContextProvider } from 'betfinio_context/lib/context';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export interface IRootRouteContext {
	queryClient: typeof queryClient;
	wagmiConfig: typeof wagmiConfig;
}

export const Route = createRootRouteWithContext<IRootRouteContext>()({
	component: () => (
		<GlobalContextProvider>
			<I18nextProvider i18n={i18n}>
				<div className="roulette max-w-screen-2xl mx-auto">
					<MockRoot>
						<Outlet />
					</MockRoot>
				</div>
			</I18nextProvider>
		</GlobalContextProvider>
	),
});
