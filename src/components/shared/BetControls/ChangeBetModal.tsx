import { Button, Dialog, DialogClose, DialogContent, type NumberFormatValues, NumericInput, toast } from '@betfinio/components/ui';
import millify from 'millify';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeChip } from '@/src/lib/shared/query';

interface ChangeBetModalProps {
	readonly initialValue: number;
	readonly max: number;
	readonly min: number;
	readonly open: boolean;
	readonly setOpen: (open: boolean) => void;
}

export const ChangeBetModal: FC<ChangeBetModalProps> = ({ initialValue, max, min, open, setOpen }) => {
	const { t } = useTranslation('roulette', { keyPrefix: 'changeBetModal' });
	const [value, setValue] = useState<number | string>(initialValue);
	const { mutate: change } = useChangeChip();

	const numericValue = useMemo(() => Number(value), [value]);

	const isValidBetValue = (value: string): boolean => {
		if (value === '') return true;
		const numValue = Number(value);
		return Number.isInteger(numValue) && numValue >= 0;
	};

	const parseValue = (value: string): number | string => {
		return value === '' ? '' : Number(value);
	};

	const handleChange = useCallback((values: NumberFormatValues) => {
		const inputValue = values.value;
		if (isValidBetValue(inputValue)) {
			setValue(parseValue(inputValue));
		}
	}, []);

	useEffect(() => {
		if (open) {
			setValue(initialValue);
		}
	}, [open, initialValue]);

	const validateAndSave = useCallback(() => {
		if (numericValue > max) {
			toast.error(`${t('maxBetIs')} ${millify(max)}`);
			return;
		}

		if (numericValue < min) {
			toast.error(`${t('minBetIs')} ${millify(min)}`);
			return;
		}

		change({ amount: numericValue });
		setValue(numericValue);
		setOpen(false);
	}, [numericValue, max, min, t, change, setOpen]);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				validateAndSave();
			}
		},
		[validateAndSave],
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className={'games w-[300px] bg-card rounded-lg roulette'} onKeyDown={handleKeyDown}>
				<div className="p-4 flex flex-col gap-4">
					<h2 className="text-sm font-medium text-foreground">{t('customAmountOfChip')}:</h2>

					<div className="flex gap-2 items-center">
						<NumericInput
							className="flex-1 rounded-lg bg-transparent p-2 px-4 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
							min={min}
							max={max}
							value={value}
							onValueChange={handleChange}
						/>
						<span className="text-sm font-medium text-muted-foreground min-w-fit">BET</span>
					</div>

					<DialogClose asChild>
						<div className="flex gap-2">
							<Button variant="destructive" className="flex-1" onClick={handleClose}>
								{t('cancel')}
							</Button>
							<Button variant="success" className="flex-1" onClick={validateAndSave}>
								{t('save')}
							</Button>
						</div>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};
