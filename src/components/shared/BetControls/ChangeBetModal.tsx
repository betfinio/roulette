import { Button, Dialog, DialogClose, DialogContent, toast } from '@betfinio/components/ui';
import millify from 'millify';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
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
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		if ((inputValue === '' || Number.isInteger(+inputValue)) && Number(+inputValue) >= 0) {
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
			<DialogContent className={'rl:w-[300px] rl:bg-card rl:rounded-lg'}>
				<div className={' rl:p-4 rl:flex rl:flex-col rl:gap-2 rl:text-foreground'}>
					<h2 className={'rl:text-sm rl:text-foreground'}>{t('customAmountOfChip')}:</h2>
					<div className={'rl:flex rl:gap-2 rl:items-center'}>
						<input
							type="number"
							className={'rl:rounded-lg rl:bg-transparent rl:p-2 rl:px-4 rl:border rl:border-border '}
							value={value}
							onChange={handleChange}
						/>
						<span className={''}>BET</span>
					</div>
					<DialogClose>
						<div className={'rl:flex rl:flex-row rl:justify-between rl:gap-2'}>
							<Button variant="destructive" className="rl:w-full" onClick={handleClose}>
								{t('cancel')}
							</Button>
							<Button variant="success" className="rl:w-full" onClick={handleSave}>
								{t('save')}
							</Button>
						</div>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
