import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import MockRoot from 'betfinio_context/components/MockRoot';
import { GlobalContextProvider } from 'betfinio_context/lib/context';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import 'betfinio_context/style';
import type { queryClient, wagmiConfig } from 'betfinio_context/config';

export interface IRootRouteContext {
	queryClient: typeof queryClient;
	wagmiConfig: typeof wagmiConfig;
}

export const Route = createRootRouteWithContext<IRootRouteContext>()({
	component: () => (
		<GlobalContextProvider>
			<I18nextProvider i18n={i18n}>
				<MockRoot>
					<Outlet />
				</MockRoot>
			</I18nextProvider>
		</GlobalContextProvider>
	),
});
