import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { useTranslation } from 'react-i18next';
import { BetsTab } from './BetsTab';
import { PlayersTab } from './PlayersTab';

export const BetDetails = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'betDetails' });
	return (
		<div className="rl:w-full  rl:p-2 rl:md:p-3 rl:border rl:border-border rl:rounded-lg rl:bg-card">
			<Tabs defaultValue={'bets'} className={' rl:min-w-72 rl:flex rl:flex-col rl:h-96 '}>
				<TabsList className={'rl:w-full rl:bg-transparent rl:justify-between rl:gap-2 rl:grid rl:grid-cols-2'}>
					<TabsTrigger value={'bets'}>{t('bets')}</TabsTrigger>
					<TabsTrigger value={'players'}>{t('players')}</TabsTrigger>
				</TabsList>
				<div className="rl:grow ">
					<div className="rl:h-full rl:relative">
						<div className="rl:absolute rl:inset-0">
							<TabsContent value={'players'} className={'rl:max-h-full rl:overflow-y-auto rl:overflow-x-hidden '}>
								<PlayersTab />
							</TabsContent>
							<TabsContent value={'bets'} className={'rl:max-h-full rl:overflow-y-auto rl:overflow-x-hidden'}>
								<BetsTab />
							</TabsContent>
						</div>
					</div>
				</div>
			</Tabs>
		</div>
	);
};
