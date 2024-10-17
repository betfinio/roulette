import { useChangeChip } from '@/src/lib/roulette/query';
import { Dialog, DialogClose, DialogContent } from 'betfinio_app/dialog';
import { toast } from 'betfinio_app/use-toast';
import millify from 'millify';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';

interface IChangeBetModalProps {
	initialValue: number;
	max: number;
	min: number;
	open: boolean;
	setOpen: (open: boolean) => void;
}
export const ChangeBetModal: FC<IChangeBetModalProps> = ({ initialValue, max, min, open, setOpen }) => {
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
				description: `Max bet is ${millify(max)}`,
				variant: 'destructive',
			});
		} else if (num < min) {
			toast({
				description: `Min bet is ${millify(min)}`,
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
			<DialogContent className={'games w-[300px] bg-card rounded-lg'}>
				<div className={' p-2 flex flex-col gap-2 text-foreground'}>
					<h2 className={'text-sm text-foreground'}>Custom amount of chip:</h2>
					<div className={'flex gap-2 items-center'}>
						<input type="number" min={0} className={'rounded-lg bg-transparent p-2 px-4 border border-border pr-10'} value={value} onChange={handleChange} />
						<span className={''}>BET</span>
					</div>
					<DialogClose>
						<div className={'flex flex-row justify-between'}>
							<button className={'bg-red-roulette rounded-lg px-4 p-2 w-2/5'} type={'button'} onClick={handleClose}>
								Cancel
							</button>
							<button className={'bg-success rounded-lg px-4 lg-2 w-2/5'} type={'button'} onClick={handleSave}>
								Save
							</button>
						</div>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
