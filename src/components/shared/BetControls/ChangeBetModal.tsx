import { Button, Dialog, DialogClose, DialogContent, type NumberFormatValues, NumericInput, toast } from '@betfinio/components/ui';
import millify from 'millify';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeChip } from '@/src/lib/shared/query';

interface IChangeBetModalProps {
	initialValue: number;
	max: number;
	min: number;
	open: boolean;
	setOpen: (open: boolean) => void;
}
export const ChangeBetModal: FC<IChangeBetModalProps> = ({ initialValue, max, min, open, setOpen }) => {
	const { t } = useTranslation('roulette', { keyPrefix: 'changeBetModal' });
	const [value, setValue] = useState<number | string>(initialValue);
	const { mutate: change } = useChangeChip();
	const handleChange = (values: NumberFormatValues) => {
		const inputValue = values.value;
		if (inputValue === '' || (Number.isInteger(+inputValue) && Number(+inputValue) >= 0)) {
			setValue(inputValue === '' ? '' : Number(inputValue));
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
			toast.error(`${t('maxBetIs')} ${millify(max)}`);
		} else if (num < min) {
			toast.error(`${t('minBetIs')} ${millify(min)}`);
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
					<h2 className={'text-sm text-foreground'}>{t('customAmountOfChip')}:</h2>
					<div className={'flex gap-2 items-center'}>
						<NumericInput className={'rounded-lg bg-transparent p-2 px-4 border border-border'} min={min} value={value} onValueChange={handleChange} />
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
