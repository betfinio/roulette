import { getChipColor } from '@/src/lib/roulette';
import { useLimits, useMediaQuery, useSelectedChip } from '@/src/lib/roulette/query';
import { BetControlChip } from './BetControlChip';

import { ZeroAddress, valueToNumber } from '@betfinio/abi';
import { Button } from 'betfinio_app/button';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ChangeBetModal } from './ChangeBetModal';
import { ExtraControls } from './ExtraControls';
import { RangeWithButtons } from './RangeWithButtons';
import { Spin } from './Spin';

export const BetControls = () => {
	const [openBetChangeModal, setOpenBetChangeModal] = useState(false);
	const { isVertical } = useMediaQuery();

	const { data: activeChipValue = 0 } = useSelectedChip();

	const { data: limitsRaw = [], isFetched: isLimitsFetched } = useLimits();
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
				{/* Mobile: 3 containers separados */}
				<div className="flex-col gap-y-2 w-full flex items-center bg-card p-4 rounded-lg border border-border">
					{/* Grupo 1: Botão de Fazer Aposta */}
					<div className="flex flex-col items-center justify-start">
						<Spin />
					</div>
				</div>

				{/* Container 2: Range de Fichas */}
				<div className="gap-y-2 flex items-center bg-card p-4 rounded-lg border border-border w-full">
					<div className="flex w-full items-center justify-center ">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="relative flex items-center justify-center">
						{/* Div com a cor atrás do SVG */}
						<div
							className="absolute h-12 w-12 opacity-25 blur-lg rounded-full pointer-events-none"
							style={{
								backgroundColor: getChipColor(activeChipValue),
								zIndex: 1, // Certifica que o div da cor fique atrás
							}}
						/>

						{/* SVG da Ficha */}
						<button type="button" onClick={() => setOpenBetChangeModal(true)}>
							<BetControlChip />
						</button>
					</div>
				</div>

				{/* Container 3: Botões de Ação */}
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
			<div className="md:flex-row md:justify-between gap-x-2 flex md:w-full border border-border items-center bg-card px-2 py-4 rounded-xl mt-6 md:px-6">
				<div className="flex flex-col items-center justify-start">
					<Spin />
				</div>
				<div className=" flex items-center justify-center gap-x-2 w-full">
					<div className="flex  items-center justify-center w-full">
						<RangeWithButtons limits={limits} />
					</div>
					<div className="relative flex items-center justify-center">
						{/* Div com a cor atrás do SVG */}
						<div
							className="absolute h-11 w-11 opacity-25 blur-lg rounded-full"
							style={{
								backgroundColor: getChipColor(activeChipValue),
								zIndex: 1, // Certifica que o div da cor fique atrás
							}}
						/>

						{/* SVG da Ficha */}

						<button type="button" onClick={() => setOpenBetChangeModal(true)}>
							<BetControlChip />
						</button>
					</div>
				</div>
				<div className="md:w-fit flex gap-2 md:gap-3 justify-center">
					<ExtraControls />
				</div>
			</div>
		</>
	);
};
