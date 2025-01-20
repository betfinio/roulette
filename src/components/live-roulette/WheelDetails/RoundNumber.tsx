import { useGetSelectedRound } from '@/src/lib/live-roulette/query';
import { useToast } from '@betfinio/components/hooks';
import { useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { type FC, type PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';

const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	transition: { duration: 0.5 },
};

const FadeInDiv = ({ key, children }: PropsWithChildren<{ key: number | string }>) => {
	return (
		<motion.slot key={key} initial={fadeIn.initial} transition={fadeIn.transition} animate={fadeIn.animate}>
			{children}
		</motion.slot>
	);
};

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
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 20">
				<text id="timerText" x="50%" y="50%" textAnchor="middle" className="fill-muted/50 text-xs" dy=".3em">
					{t('round')} #{round}
				</text>
			</svg>

			{addressCopied ? (
				<FadeInDiv key={'check-icon-address'}>
					<CheckIcon className={'text-green-500 w-[10%]'} />
				</FadeInDiv>
			) : (
				<FadeInDiv key={'copy-icon-address'}>
					<CopyIcon className={'text-secondary-foreground cursor-pointer w-[10%]'} onClick={handleCopyRoundAddress} />
				</FadeInDiv>
			)}
		</>
	);
};
