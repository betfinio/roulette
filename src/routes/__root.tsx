import instance from '@/src/i18n.ts';
import { Toaster } from '@betfinio/components/ui';
import { createRootRoute } from '@tanstack/react-router';
import { Root } from 'betfinio_app/root';
import { VersionValidation } from '../components/VersionValidation';
import { PUBLIC_BRANCH, PUBLIC_DEPLOYED } from '../global';

export const Route = createRootRoute({
	component: () => (
		<Root id={'roulette'} instance={instance}>
			<Toaster />
			<VersionValidation repository={'roulette'} branch={PUBLIC_BRANCH} current={PUBLIC_DEPLOYED} />
		</Root>
	),
});
