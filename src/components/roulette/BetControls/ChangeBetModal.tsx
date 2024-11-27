import { useChangeChip } from '@/src/lib/roulette/query';
import { toast } from '@betfinio/components/hooks';
import { Button, Dialog, DialogClose, DialogContent } from '@betfinio/components/ui';
import millify from 'millify';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IChangeBetModalProps {
	initialValue: number;
	max: number;
	min: number;
	open: boolean;
	setOpen: (open: boolean) => void;
}
export const ChangeBetModal: FC<IChangeBetModalProps> = ({ initialValue, max, min, open, setOpen }) => {
	const { t } = useTranslation('roulette', { keyPrefix: 'changeBetModal' });
	const [value, setValue] = useState(initialValue);
	const { mutate: change } = useChangeChip();
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		if ((inputValue === '' || Number.isInteger(+inputValue)) && Number(+inputValue) >= 0) {
			setValue(Number(inputValue));
		}
	};

	useEffect(() => {
		if (open) {
			setValue(initialValue);
		}
	}, [open]);

	const handleSave = () => {
		const num = Number(value);
		if (num > max) {
			toast({
				description: `${t('maxBetIs')} ${millify(max)}`,
				variant: 'destructive',
			});
		} else if (num < min) {
			toast({
				description: `${t('minBetIs')} ${millify(min)}`,
				variant: 'destructive',
			});
		} else {
			change({ amount: Number(value) });

			setValue(Number(value));
			handleClose();
		}
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className={'games w-[300px] bg-card rounded-lg roulette'}>
				<div className={' p-4 flex flex-col gap-2 text-foreground'}>
					<h2 className={'text-sm text-foreground'}>{t('customMmountOfChip')}:</h2>
					<div className={'flex gap-2 items-center'}>
						<input type="number" min={0} className={'rounded-lg bg-transparent p-2 px-4 border border-border '} value={value} onChange={handleChange} />
						<span className={''}>BET</span>
					</div>
					<DialogClose>
						<div className={'flex flex-row justify-between gap-2'}>
							<Button variant="destructive" className="w-full" onClick={handleClose}>
								{t('cancel')}
							</Button>
							<Button variant="success" className="w-full" onClick={handleSave}>
								{t('save')}
							</Button>
						</div>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
