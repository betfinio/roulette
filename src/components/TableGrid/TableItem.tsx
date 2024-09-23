import type React from 'react';
import './TableItem.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface TableItemProps {
	number: number | string;
	centerSelection?: number[];
	topSelection?: number[];
	leftSelection?: number[];
	rightSelection?: number[];
	bottomSelection?: number[];
	topLeftSelection?: number[];
	topRightSelection?: number[];
	bottomLeftSelection?: number[];
	bottomRightSelection?: number[];
	isRangeButton?: boolean;
	isZero?: boolean;
	className?: string;
	onHoverNumbers?: (numbers: number[]) => void;
	onLeaveHover?: () => void;
	isDebugMode?: boolean;
	placedChips?: {
		number: number | string;
		value: number;
		position: string;
	}[];
	getChipColor?: (value: number) => string;
	onClick?: (position: string, relatedNumbers: number[]) => void;
}

type PositionType = 'center' | 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

const TableItem: React.FC<TableItemProps> = ({
	number,
	centerSelection,
	topSelection,
	leftSelection,
	rightSelection,
	bottomSelection,
	topLeftSelection,
	topRightSelection,
	bottomLeftSelection,
	bottomRightSelection,
	className = '',
	isRangeButton = false,
	onHoverNumbers,
	onLeaveHover,
	isDebugMode = false,
	placedChips = [],
	getChipColor,
	onClick,
}) => {
	const [showAlert, setShowAlert] = useState(false);

	// Estado global para controlar a contagem de fichas adicionadas
	const [chipCounts, setChipCounts] = useState({
		center: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		topLeft: 0,
		topRight: 0,
		bottomLeft: 0,
		bottomRight: 0,
	});

	// Estado para tremores por posição
	const [shake, setShake] = useState<Record<PositionType, boolean>>({
		center: false,
		top: false,
		left: false,
		right: false,
		bottom: false,
		topLeft: false,
		topRight: false,
		bottomLeft: false,
		bottomRight: false,
	});

	const maxChipsToShow = 5; // Limite de fichas

	// Função que adiciona uma ficha e incrementa a contagem global
	const addChip = (position: PositionType, relatedNumbers: number[]) => {
		if (chipCounts[position] < maxChipsToShow) {
			setChipCounts((prevCounts) => ({
				...prevCounts,
				[position]: prevCounts[position] + 1,
			}));
			onClick?.(position, relatedNumbers);
		} else {
			triggerAlert(); // Exibir alerta e tremer
			triggerShake(position); // Chamar tremida na posição afetada
		}
	};

	const triggerAlert = () => {
		if (!showAlert) {
			setShowAlert(true);
			setTimeout(() => setShowAlert(false), 1500); // Mostra o alerta por 1.5 segundos
		}
	};

	const triggerShake = (position: string) => {
		setShake({ ...shake, [position]: true });
		setTimeout(() => setShake({ ...shake, [position]: false }), 500);
	};

	const handleHover = (numbers: number[]) => {
		onHoverNumbers?.(numbers);
	};

	const handleLeave = () => {
		onLeaveHover?.();
	};

	const handleClick = (position: PositionType, relatedNumbers?: number[]) => {
		if (relatedNumbers?.length) {
			addChip(position, relatedNumbers);
		}
	};

	const abbreviateValue = (value: number) => {
		return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
	};

	const chipsOnThisNumber = placedChips.filter((chip) => chip.number === number);

	const renderChip = (position: PositionType) => {
		const chipsForPosition = chipsOnThisNumber.filter((chip) => chip.position === position);

		const maxChipsToShow = Math.min(chipsForPosition.length, 5);
		const totalOffset = maxChipsToShow * 2; // Deslocamento total a ser distribuído
		const startOffset = totalOffset / 2; // Começar a centralização

		return chipsForPosition.slice(0, maxChipsToShow).map((chip, index) => {
			const zIndex = chipCounts[position] + index + 1;
			const offset = (index + 1) * 2; // Deslocamento progressivo

			// Deslocamento para centralizar as fichas
			const xOffset = offset - startOffset;
			const yOffset = offset - startOffset;

			return (
				<div
					key={`${chip.number}-${chip.position}-${index}`}
					className="pointer-events-none absolute"
					style={{
						zIndex,
						transform: `translate(${xOffset}px, ${yOffset}px)`,
					}}
				>
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg width="32" height="32" viewBox="0 0 154 154" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M77.0001 154C119.526 154 154 119.526 154 77C154 34.4741 119.526 0 77.0001 0C34.4741 0 0 34.4741 0 77C0 119.526 34.4741 154 77.0001 154Z"
							fill="#131624"
						/>
						<path
							d="M76.9988 124.309C103.127 124.309 124.308 103.128 124.308 77C124.308 50.8723 103.127 29.6914 76.9988 29.6914C50.8708 29.6914 29.6899 50.8723 29.6899 77C29.6899 103.128 50.8708 124.309 76.9988 124.309Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M77.0006 1.33809C118.654 1.39289 152.377 35.2059 152.321 76.8608C152.265 118.515 118.454 152.238 76.7995 152.182C35.1449 152.126 1.42239 118.314 1.47817 76.6597C1.51878 46.3828 19.6597 19.0649 47.5499 7.28322C56.8661 3.34012 66.8835 1.31774 77.0006 1.33809ZM77.0006 0C34.4707 0 0 34.4699 0 76.9994C0 119.53 34.4707 154 77.0006 154C119.53 154 154 119.526 154 76.9994C154 34.4729 119.526 0 77.0006 0Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M77.0004 18.0427C109.458 18.0854 135.735 44.4332 135.692 76.8915C135.648 109.35 109.302 135.627 76.8438 135.583C44.3856 135.54 18.1084 109.193 18.1518 76.7348C18.1835 53.1425 32.3192 31.8558 54.0519 22.6752C61.3112 19.6027 69.117 18.0268 77.0004 18.0427ZM77.0004 17C43.8603 17 17 43.8597 17 76.9995C17 110.14 43.8603 137 77.0004 137C110.14 137 137 110.137 137 76.9995C137 43.862 110.138 17 77.0004 17Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M78.635 62.4966C77.4509 62.4922 75.8487 62.4823 73.9155 62.4553L71.6621 68.6357H76.4191L78.635 62.4966ZM72.4409 68.0906L74.295 63.0053C75.494 63.0207 76.6891 63.0317 77.8601 63.0378L76.0401 68.0906H72.4409Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path d="M68.6221 70.9082L69.6313 70.9049L70.2836 69.1152H69.2689L68.6221 70.9082Z" fill={getChipColor ? getChipColor(chip.value) : '#fff'} />
						<path
							d="M66.4414 70.9203L67.7768 70.9148L68.4264 69.1152H67.0932C66.8759 69.7175 66.6592 70.3192 66.4414 70.9203ZM67.4743 69.6603H67.6498L67.3924 70.3714H67.2169L67.4743 69.6603Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M70.8369 70.9026H72.3335C73.5732 70.9026 74.6616 70.9054 75.5994 70.9114L76.2456 69.1206H71.487L70.8369 70.9026ZM71.8698 69.6624H75.4718L75.2188 70.3636C74.2843 70.3592 73.3158 70.357 72.3351 70.357H71.6174L71.8698 69.6624Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M86.51 67.9602C86.2603 68.1714 85.9886 68.3557 85.701 68.5113C85.025 68.8765 84.3353 69.0327 82.8124 69.113C82.3663 69.1361 81.8532 69.1532 81.2812 69.1532C80.806 69.1532 80.2906 69.1416 79.739 69.113L79.0889 70.9154C80.7086 70.8741 82.2442 70.6701 83.8959 69.8352C84.86 69.3506 85.7417 68.7181 86.51 67.9602ZM79.8776 70.3373L80.1157 69.6784C80.5046 69.6933 80.8945 69.701 81.2812 69.701C81.8004 69.701 82.3251 69.6872 82.841 69.6597L82.9939 69.6515C81.8911 70.1019 80.8566 70.2708 79.8776 70.3373Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M82.5682 68.6346C83.8882 68.5565 84.5658 68.5098 85.3369 68.1523C85.9122 67.8872 86.9896 67.3905 87.2652 66.3472C87.599 65.0778 86.5073 63.9151 86.301 63.6995C85.3072 62.644 83.9294 62.4444 83.0241 62.4444C82.7211 62.4433 82.4191 62.4658 82.1194 62.5131L79.9111 68.633C80.3005 68.6566 80.746 68.6731 81.2399 68.6731C81.6497 68.6748 82.0946 68.6627 82.5682 68.6346ZM82.5176 63.0125C82.6551 63.0004 82.8272 62.99 83.023 62.99C83.8711 62.99 85.0591 63.1781 85.9028 64.074C86.2306 64.4183 86.9676 65.3264 86.7355 66.2091C86.5287 67.0044 85.6383 67.4142 85.1081 67.6556C84.4398 67.9642 83.8684 68.0093 82.5363 68.0885C82.1062 68.1138 81.6695 68.127 81.2383 68.127C81.0513 68.127 80.8621 68.127 80.6734 68.1193L82.5176 63.0125Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M80.9191 62.501C80.5797 62.501 80.2195 62.501 79.8372 62.501L77.624 68.6357H78.707L80.9191 62.501Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M77.8795 70.9258L78.5324 69.1152H77.4489L76.7993 70.9165L77.2734 70.9203L77.8795 70.9258Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M53.5122 22.1719C60.974 19.0035 68.9127 17.3993 77.1082 17.3993V6.06892e-05H76.9988C66.5933 -0.0130261 56.294 2.09051 46.7271 6.18255L53.5122 22.1719Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M114.393 9.67871L106.383 24.119C113.487 28.0518 119.725 33.3747 124.726 39.7708L137.687 29.6064C131.329 21.4768 123.409 14.7013 114.393 9.67871Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M137.574 77.0434C137.577 81.7278 137.039 86.3967 135.971 90.9568L151.95 94.7144C154.306 84.6747 154.633 74.2665 152.915 64.0986L136.721 66.8404C137.291 70.2124 137.576 73.6252 137.574 77.0434Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M134.557 128.141L122.293 117.224C116.906 123.293 110.351 128.215 103.019 131.693L110.076 146.547C119.383 142.108 127.707 135.849 134.557 128.141Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M43.3848 146.291C52.6688 150.803 62.7691 153.392 73.0788 153.902L73.928 137.425C65.8392 137.022 57.9153 134.981 50.6383 131.425L43.3848 146.291Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M2.06592 94.7638C4.43326 104.777 8.79253 114.211 14.8841 122.504L27.964 113.102C23.2273 106.533 19.8743 99.0698 18.1076 91.1663L2.06592 94.7638Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M2.6416 56.9492L18.8789 61.4999C21.0616 53.6966 24.8044 46.4176 29.8808 40.1021L16.4895 29.3772C10.0543 37.5358 5.34368 46.9156 2.6416 56.9492Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<path
							d="M53.5122 22.1719C60.974 19.0035 68.9127 17.3993 77.1082 17.3993V6.06892e-05H76.9988C66.5933 -0.0130261 56.294 2.09051 46.7271 6.18255L53.5122 22.1719Z"
							fill={getChipColor ? getChipColor(chip.value) : '#fff'}
						/>
						<text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#000" className="text-[37px] font-semibold">
							{abbreviateValue(chip.value)}
						</text>
					</svg>
				</div>
			);
		});
	};

	return (
		<motion.div
			className={`text-xs ${isRangeButton ? 'table-external-item-v' : 'table-item-v'} ${className}`}
			transition={{ duration: 0.5 }}
			onMouseEnter={() => handleHover(centerSelection || [])}
			onMouseLeave={handleLeave}
			onClick={() => handleClick('center', centerSelection)}
		>
			{/* Alerta animado */}
			<AnimatePresence>
				{showAlert && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.5 }}
						className="fixed top-4 left-0 right-0 text-center bg-red-500 text-white p-2 rounded-md"
					>
						Chip staking limit: 5
					</motion.div>
				)}
			</AnimatePresence>

			<div className={`${isRangeButton ? 'side-item-v-text' : 'number-display'}`}>{number !== 'Black' && number !== 'Red' ? number : ''}</div>

			{centerSelection?.length && (
				<motion.div
					className={`selection-ball center-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(centerSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('center', centerSelection);
					}}
				>
					{renderChip('center')}
				</motion.div>
			)}

			{/* Adicionando os chips para outras posições */}
			{topSelection?.length && (
				<motion.div
					className={`selection-ball top-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(topSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('top', topSelection);
					}}
				>
					{renderChip('top')}
				</motion.div>
			)}
			{leftSelection?.length && (
				<motion.div
					className={`selection-ball left-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(leftSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('left', leftSelection);
					}}
				>
					{renderChip('left')}
				</motion.div>
			)}
			{rightSelection?.length && (
				<motion.div
					className={`selection-ball right-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(rightSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('right', rightSelection);
					}}
				>
					{renderChip('right')}
				</motion.div>
			)}
			{bottomSelection?.length && (
				<motion.div
					className={`selection-ball bottom-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(bottomSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('bottom', bottomSelection);
					}}
				>
					{renderChip('bottom')}
				</motion.div>
			)}
			{topLeftSelection?.length && (
				<motion.div
					className={`selection-ball top-left-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(topLeftSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('topLeft', topLeftSelection);
					}}
				>
					{renderChip('topLeft')}
				</motion.div>
			)}
			{topRightSelection?.length && (
				<motion.div
					className={`selection-ball top-right-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(topRightSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('topRight', topRightSelection);
					}}
				>
					{renderChip('topRight')}
				</motion.div>
			)}
			{bottomLeftSelection?.length && (
				<motion.div
					className={`selection-ball bottom-left-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(bottomLeftSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('bottomLeft', bottomLeftSelection);
					}}
				>
					{renderChip('bottomLeft')}
				</motion.div>
			)}
			{bottomRightSelection?.length && (
				<motion.div
					className={`selection-ball bottom-right-ball ${!isDebugMode ? 'hidden-balls' : ''}`}
					onMouseEnter={(e) => {
						e.stopPropagation();
						handleHover(bottomRightSelection);
					}}
					onMouseLeave={handleLeave}
					onClick={(e) => {
						e.stopPropagation();
						handleClick('bottomRight', bottomRightSelection);
					}}
				>
					{renderChip('bottomRight')}
				</motion.div>
			)}
		</motion.div>
	);
};

export default TableItem;
