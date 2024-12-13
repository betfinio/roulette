import instance from '@/src/i18n.ts';
import { Toaster } from '@betfinio/components/ui';
import { createRootRouteWithContext } from '@tanstack/react-router';
import type { queryClient, wagmiConfig } from 'betfinio_app/config';
import { Root } from 'betfinio_app/root';
import { VersionValidation } from '../components/VersionValidation';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED } from '../global';

interface IRootRouteContext {
	queryClient: typeof queryClient;
	wagmiConfig: typeof wagmiConfig;
}

export const Route = createRootRouteWithContext<IRootRouteContext>()({
	component: () => (
		<Root id={'roulette'} instance={instance}>
			<Toaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</Root>
	),
});
