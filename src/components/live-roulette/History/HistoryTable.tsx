import { Tabs, TabsContent, TabsList, TabsTrigger } from '@betfinio/components/ui';
import { useTranslation } from 'react-i18next';
import { AllBetsTable } from './AllBetsTable';
import { MyBetsTable } from './MyBets';

const History = () => {
	const { t } = useTranslation('roulette', { keyPrefix: 'table' });

	return (
		<Tabs defaultValue={'my'}>
			<TabsList>
				<TabsTrigger value={'my'}>{t('myRounds')}</TabsTrigger>
				<TabsTrigger value={'all'}>{t('allRounds')}</TabsTrigger>
			</TabsList>

			<TabsContent value={'my'}>
				<MyBetsTable />
			</TabsContent>
			<TabsContent value={'all'}>
				<AllBetsTable />
			</TabsContent>
		</Tabs>
	);
};

export default History;
