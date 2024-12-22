import { useGetSelectedRound } from '@/src/lib/roulette/query';
import { useTranslation } from 'react-i18next';

export const RoundNumber = () => {
	const { t } = useTranslation('roulette');

	const { round } = useGetSelectedRound();

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 20">
			<text id="timerText" x="50%" y="50%" textAnchor="middle" className="fill-muted/50 text-xs" dy=".3em">
				{t('round')} #{round}
			</text>
		</svg>
	);
};
