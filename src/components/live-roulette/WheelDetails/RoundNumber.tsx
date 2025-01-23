import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { useToast } from '@betfinio/components/hooks';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const RoundNumber: FC = () => {
	const { toast } = useToast();
	const { t } = useTranslation('roulette');

	const { round } = useGetSelectedRound();
	const [addressCopied, setAddressCopied] = useState(false);

	const handleCopyRoundAddress = async () => {
		toast({
			title: t('copiedCurrentRoundRef'),
			variant: 'default',
		});
		await navigator.clipboard.writeText(location.href);
		setAddressCopied(true);
		setTimeout(() => {
			setAddressCopied(false);
		}, 5000);
	};

	return (
		<>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 20" className="w-full">
				<text id="timerText" x="50%" y="50%" textAnchor="middle" className="fill-muted/50 text-xs" dy=".3em">
					{t('round')} #{round}
				</text>
			</svg>

			{addressCopied ? (
				<CheckIcon className={'text-success w-[10%]'} />
			) : (
				<CopyIcon className={'text-secondary-foreground cursor-pointer w-[10%]'} onClick={handleCopyRoundAddress} />
			)}
		</>
	);
};
