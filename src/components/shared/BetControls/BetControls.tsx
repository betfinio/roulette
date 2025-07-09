import { valueToNumber } from '@betfinio/abi';
import { useMediaQuery } from '@betfinio/components/hooks';
import { Button } from '@betfinio/components/ui';
import { useMemo, useState } from 'react';
import { getChipColor } from '@/src/lib/roulette';
import { useLimits, useSelectedChip, useVisibleTable } from '@/src/lib/shared/query';
import { BetControlChip } from './BetControlChip';
import { ChangeBetModal } from './ChangeBetModal';
import { ExtraControls } from './ExtraControls';
import { RangeWithButtons } from './RangeWithButtons';
import { SubmitBet } from './SubmitBet';

export const BetControls = () => {
	const { table } = useVisibleTable();
	const [openBetChangeModal, setOpenBetChangeModal] = useState(false);
	const { isVertical } = useMediaQuery();

	const { data: activeChipValue = 0 } = useSelectedChip();

	const { data: limitsRaw = [] } = useLimits(table);
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

				<div className="rl:flex-col rl:gap-y-2 rl:w-full rl:flex rl:items-center rl:bg-card rl:p-4 rl:rounded-lg rl:border rl:border-border">
					<div className="rl:flex rl:flex-col rl:items-center rl:justify-start w-full">
						<SubmitBet />
					</div>
				</div>

				<div className="rl:gap-y-2 rl:flex rl:items-center rl:bg-card rl:p-4 rl:rounded-lg rl:border rl:border-border rl:w-full rl:flex-col">
					<div className="rl:flex rl:w-full rl:items-center rl:justify-center ">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="rl:relative rl:flex rl:items-center rl:justify-center">
						<div
							className="rl:absolute rl:h-12 rl:w-12 rl:opacity-25 rl:blur-lg rl:rounded-full rl:pointer-events-none"
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

				<div className="rl:w-full rl:flex-col rl:gap-y-2 rl:flex rl:items-center rl:bg-card rl:border rl:border-border rl:p-4 rl:rounded-lg">
					<div className="rl:flex rl:gap-2 rl:justify-center">
						<ExtraControls />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<ChangeBetModal initialValue={activeChipValue} max={limits.max} min={limits.min} open={openBetChangeModal} setOpen={setOpenBetChangeModal} />
			<div className="rl:md:flex-row rl:md:justify-between rl:gap-2 rl:flex rl:w-full rl:border rl:border-border rl:items-center rl:bg-card rl:px-2 rl:py-4 rl:rounded-xl rl:mt-6 rl:md:px-6 rl:flex-wrap">
				<div className="rl:flex rl:flex-col rl:items-center rl:justify-start rl:shrink-0">
					<SubmitBet />
				</div>
				<div className=" rl:flex rl:items-center rl:justify-center rl:gap-x-2 rl:grow rl:shrink-0 rl:min-w-96">
					<div className="rl:flex  rl:items-center rl:justify-center rl:w-full">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="rl:relative rl:flex rl:items-center rl:justify-center">
						<div
							className="rl:absolute rl:h-11 rl:w-11 rl:opacity-25 rl:blur-lg rl:rounded-full rl:pointer-events-none"
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
				<div className="rl:md:w-fit rl:flex rl:gap-2 rl:md:gap-3 rl:justify-center rl:shrink-0">
					<ExtraControls />
				</div>
			</div>
		</>
	);
};
