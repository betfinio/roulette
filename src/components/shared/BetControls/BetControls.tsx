import { getChipColor } from '@/src/lib/roulette';
import { useGetTableAddress, useLimits, useSelectedChip } from '@/src/lib/roulette/query';
import { valueToNumber } from '@betfinio/abi';
import { useMediaQuery } from '@betfinio/components/hooks';
import { Button } from '@betfinio/components/ui';
import { useMemo, useState } from 'react';
import { BetControlChip } from './BetControlChip';
import { ChangeBetModal } from './ChangeBetModal';
import { ExtraControls } from './ExtraControls';
import { RangeWithButtons } from './RangeWithButtons';
import { SubmitBet } from './SubmitBet';

export const BetControls = () => {
	const { tableAddress, isSingle } = useGetTableAddress();
	const [openBetChangeModal, setOpenBetChangeModal] = useState(false);
	const { isVertical } = useMediaQuery();

	const { data: activeChipValue = 0 } = useSelectedChip();

	const { data: limitsRaw = [] } = useLimits(tableAddress);
	const limits = useMemo(() => {
		if (limitsRaw.length > 0) {
			return {
				min: Math.min(...limitsRaw.map((limit) => valueToNumber(limit.min))),
				max: Math.max(...limitsRaw.map((limit) => valueToNumber(limit.max))),
			};
		}
		return { min: 10000, max: 1000000 };
	}, [limitsRaw]);

	if (isVertical) {
		return (
			<>
				<ChangeBetModal initialValue={activeChipValue} max={limits.max} min={limits.min} open={openBetChangeModal} setOpen={setOpenBetChangeModal} />

				<div className="flex-col gap-y-2 w-full flex items-center bg-card p-4 rounded-lg border border-border">
					<div className="flex flex-col items-center justify-start w-full">
						<SubmitBet />
					</div>
				</div>

				<div className="gap-y-2 flex items-center bg-card p-4 rounded-lg border border-border w-full flex-col">
					<div className="flex w-full items-center justify-center ">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="relative flex items-center justify-center">
						<div
							className="absolute h-12 w-12 opacity-25 blur-lg rounded-full pointer-events-none"
							style={{
								backgroundColor: getChipColor(activeChipValue),
								zIndex: 1, // Certifica que o div da cor fique atrás
							}}
						/>

						<button type="button" onClick={() => setOpenBetChangeModal(true)}>
							<BetControlChip />
						</button>
					</div>
				</div>

				<div className="w-full flex-col gap-y-2 flex items-center bg-card border border-border p-4 rounded-lg">
					<div className="flex gap-2 justify-center">
						<ExtraControls />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<ChangeBetModal initialValue={activeChipValue} max={limits.max} min={limits.min} open={openBetChangeModal} setOpen={setOpenBetChangeModal} />
			<div className="md:flex-row md:justify-between gap-2 flex w-full border border-border items-center bg-card px-2 py-4 rounded-xl mt-6 md:px-6 flex-wrap">
				<div className="flex flex-col items-center justify-start flex-shrink-0">
					<SubmitBet />
				</div>
				<div className=" flex items-center justify-center gap-x-2 flex-grow flex-shrink-0 min-w-96">
					<div className="flex  items-center justify-center w-full">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="relative flex items-center justify-center">
						<div
							className="absolute h-11 w-11 opacity-25 blur-lg rounded-full pointer-events-none"
							style={{
								backgroundColor: getChipColor(activeChipValue),
								zIndex: 1,
							}}
						/>

						<Button variant="ghost" type="button" onClick={() => setOpenBetChangeModal(true)}>
							<BetControlChip />
						</Button>
					</div>
				</div>
				<div className="md:w-fit flex gap-2 md:gap-3 justify-center flex-shrink-0">
					<ExtraControls />
				</div>
			</div>
		</>
	);
};
