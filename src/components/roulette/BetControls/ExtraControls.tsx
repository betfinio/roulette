import { useClearAllBets, useDoublePlace, useUndoPlace } from '@/src/lib/roulette/query';
import { Button } from 'betfinio_app/button';
import { CircleX, Undo2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ExtraControls = () => {
	const { t } = useTranslation('roulette');
	const { mutate: undo } = useUndoPlace();
	const { mutate: double } = useDoublePlace();
	const { mutate: clearAll } = useClearAllBets();
	return (
		<>
			<Button variant="tertiary" onClick={() => double()}>
				x2
			</Button>
			<Button variant="tertiary" onClick={() => clearAll()} className="flex gap-2">
				<CircleX className={'w-4 h-4'} />
				{t('clear')}
			</Button>
			<Button variant="tertiary" onClick={() => undo()} className="flex gap-2">
				<Undo2 className={'w-4 h-4'} />
				{t('undo')}
			</Button>
		</>
	);
};
