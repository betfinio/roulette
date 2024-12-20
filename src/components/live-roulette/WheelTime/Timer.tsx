import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface TimerProps {
	timeLeft: string;
}
export const Timer: FC<TimerProps> = ({ timeLeft }) => {
	const { t } = useTranslation('roulette');

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
			<text id="timerText" x="50%" y="10%" textAnchor="middle" className="fill-muted/50 text-xs" dy=".3em">
				{t('timeLeft')}
			</text>
			<text id="timerText" x="50%" y="40%" textAnchor="middle" className="fill-foreground font-medium  text-xl" dy=".3em">
				{timeLeft}
			</text>
		</svg>
	);
};
