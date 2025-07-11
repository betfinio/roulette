import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface TimerProps {
	timeLeft: string;
}
export const Timer: FC<TimerProps> = ({ timeLeft }) => {
	const { t } = useTranslation('roulette');

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 25" className="w-full">
			<text id="timerText" x="50%" y="20%" textAnchor="middle" className="fill-muted/50 text-xs" dy=".3em">
				{t('timeLeft')}
			</text>
			<text id="timerText" x="50%" y="75%" textAnchor="middle" className="fill-foreground font-medium  text-sm" dy=".3em">
				{timeLeft}
			</text>
		</svg>
	);
};
