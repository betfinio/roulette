import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { useTranslation } from 'react-i18next';
import { BetsTab } from './BetsTab';
import { PlayersTab } from './PlayersTab';

export const BetDetails = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'betDetails' });
	return (
		<div className="w-full h-full p-2 md:p-3 border border-border rounded-lg bg-card">
			<Tabs defaultValue={'bets'} className={' min-w-72 flex flex-col h-96 lg:h-full'}>
				<TabsList className={'w-full bg-transparent justify-between gap-2 grid grid-cols-2'}>
					<TabsTrigger value={'bets'}>{t('bets')}</TabsTrigger>
					<TabsTrigger value={'players'}>{t('players')}</TabsTrigger>
				</TabsList>
				<div className="flex-grow ">
					<div className="h-full relative">
						<div className="absolute inset-0">
							<TabsContent value={'players'} className={'max-h-full overflow-y-auto overflow-x-hidden '}>
								<PlayersTab />
							</TabsContent>
							<TabsContent value={'bets'} className={'max-h-full overflow-y-auto overflow-x-hidden'}>
								<BetsTab />
							</TabsContent>
						</div>
					</div>
				</div>
			</Tabs>
		</div>
	);
};
