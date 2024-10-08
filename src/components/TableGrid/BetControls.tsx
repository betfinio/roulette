import type React from 'react';
import { useRef, useState } from 'react';
import clearIcon from '../../assets/images/clear-icon.svg';
// import debugIcon from '../../assets/images/debug-icon.svg'; // don't remove, we can uncomment to use the debug buttom
import minusIcon from '../../assets/images/minus-icon.svg';
import plusIcon from '../../assets/images/plus-icon.svg';
import undoIcon from '../../assets/images/undo-icon.svg';
import { useWheel } from '../../contexts/WheelContext';

const BetControls: React.FC = () => {
	const {
		activeChipValue,
		setActiveChipValue,
		undoLastBet,
		cleanAllBets,
		isWheelWheelSpinning,
		isVertical, // variável para controlar o layout mobile
	} = useWheel();

	const [incrementSpeed, setIncrementSpeed] = useState(1);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const getChipColor = (value: number) => {
		if (value <= 1000) return 'var(--blue)';
		if (value <= 5000) return 'var(--blue-purple)';
		if (value <= 10000) return 'var(--purple-lighter)';
		if (value <= 50000) return 'var(--orange)';
		return 'var(--yellow)';
	};

	const formatChipValue = (value: number) => {
		return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
	};

	const handleChipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveChipValue(Number(e.target.value) * 1000);
	};

	const increaseChipValue = () => setActiveChipValue((prevValue) => Math.min(prevValue + 1000, 100000));

	const decreaseChipValue = () => setActiveChipValue((prevValue) => Math.max(prevValue - 1000, 1000));

	const startIncrement = (direction: 'increase' | 'decrease') => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			direction === 'increase' ? increaseChipValue() : decreaseChipValue();
			setIncrementSpeed((prev) => Math.min(prev * 1.1, 10));
		}, 200 / incrementSpeed);
	};

	const stopIncrement = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIncrementSpeed(1);
	};

	return (
		<>
			{isVertical ? (
				<>
					{/* Mobile: 3 containers separados */}
					<div className="flex-col gap-y-2 w-full flex items-center bg-[#131624] p-4 rounded-xl">
						{/* Grupo 1: Botão de Fazer Aposta */}
						<div className="flex flex-col items-center justify-start">
							<button
								disabled={isWheelWheelSpinning}
								type="button"
								className="w-full text-sm text-[var(--bg-sec)] h-14 rounded-lg border-[var(--border-primary)] border-default bg-[var(--yellow)] active:bg-[var(--yellow)] transition flex flex-col items-center justify-center px-10 mb-2 cursor-pointer"
							>
								<span className="whitespace-nowrap text-xs font-bold">Place BET</span>
								<span className="whitespace-nowrap text-xs font-bold">and WIN 234k</span>
							</button>
							<button
								type="button"
								className="text-[10px] w-full text-white font-medium transition-all whitespace-nowrap max-w-20 text-wrap absolute ml-64 mt-3"
							>
								+165k from signed bets
							</button>
						</div>
					</div>

					{/* Container 2: Range de Fichas */}
					<div className="gap-y-2 flex items-center bg-[#131624] p-4 rounded-xl">
						<div className="flex w-full items-center justify-center">
							<div
								className="w-11 h-9 flex items-center justify-center bg-primary rounded-lg border-[var(--border-primary)] border-default cursor-pointer active:bg-[var(--bg-primary)] transition-all"
								onMouseDown={() => startIncrement('decrease')}
								onMouseUp={stopIncrement}
								onMouseLeave={stopIncrement}
								onClick={decreaseChipValue}
							>
								<img src={minusIcon} alt="Decrease" />
							</div>
							<div className="flex flex-col mb-4">
								<div className="flex justify-between text-white text-[9px] md:text-xs mb-1 px-2">
									<span>1k</span>
									<span>5k</span>
									<span>10k</span>
									<span>50k</span>
									<span>100k</span>
								</div>
								<div className="relative w-full flex items-center">
									<input
										type="range"
										min="1"
										max="100"
										step="1"
										value={activeChipValue / 1000}
										onChange={handleChipChange}
										className="w-full h-[2px] appearance-none bg-[#3b3f51] cursor-pointer accent-[var(--yellow)]"
									/>
								</div>
							</div>
							<div
								className="text-sm md:text-base uppercase text-white font-normal h-[36px] rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-end gap-x-1 cursor-pointer active:bg-[var(--bg-primary)] transition-all text-nowrap md:w-44 px-2 mr-2"
								onMouseDown={() => startIncrement('increase')}
								onMouseUp={stopIncrement}
								onMouseLeave={stopIncrement}
								onClick={increaseChipValue}
							>
								<span className="w-20 text-end">{formatChipValue(activeChipValue)} BET</span>
								<img src={plusIcon} alt="Increase" />
							</div>
						</div>
						<div className="relative flex items-center justify-center">
							{/* Div com a cor atrás do SVG */}
							<div
								className="absolute h-12 w-12 opacity-25 blur-lg rounded-full"
								style={{
									backgroundColor: getChipColor(activeChipValue),
									zIndex: 1, // Certifica que o div da cor fique atrás
								}}
							/>

							{/* SVG da Ficha */}

							<svg width="50" height="50" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84973 34.1503 0 22 0C9.84973 0 0 9.84973 0 22C0 34.1503 9.84973 44 22 44Z" fill="#131624" />
								<path
									d="M21.9997 35.5169C29.4648 35.5169 35.5165 29.4654 35.5165 22.0001C35.5165 14.5351 29.4648 8.4834 21.9997 8.4834C14.5346 8.4834 8.48291 14.5351 8.48291 22.0001C8.48291 29.4654 14.5346 35.5169 21.9997 35.5169Z"
									fill="url(#paint0_linear_326_7184)"
								/>
								<path
									d="M22.0001 5.15533C31.2737 5.16753 38.7815 12.6955 38.7691 21.9693C38.7566 31.243 31.2291 38.7508 21.9554 38.7383C12.6816 38.7259 5.17385 31.1983 5.18627 21.9245C5.19531 15.1838 9.2341 9.10193 15.4434 6.47892C17.5175 5.60105 19.7477 5.1508 22.0001 5.15533ZM22.0001 4.85742C12.5315 4.85742 4.85718 12.5316 4.85718 22.0001C4.85718 31.4688 12.5315 39.1431 22.0001 39.1431C31.4686 39.1431 39.1429 31.4681 39.1429 22.0001C39.1429 12.5323 31.4679 4.85742 22.0001 4.85742Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M15.2892 6.33482C17.4211 5.42957 19.6893 4.97123 22.0309 4.97123V1.73398e-05H21.9996C19.0267 -0.00372174 16.084 0.597287 13.3506 1.76644L15.2892 6.33482Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M32.6837 2.76465L30.3953 6.89043C32.4248 8.01412 34.2072 9.53494 35.6361 11.3624L39.339 8.45828C37.5226 6.13552 35.2598 4.19966 32.6837 2.76465Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M39.3071 22.012C39.3079 23.3504 39.1542 24.6844 38.8489 25.9872L43.4145 27.0608C44.0874 24.1923 44.181 21.2186 43.6901 18.3135L39.0634 19.0968C39.226 20.0603 39.3074 21.0353 39.3071 22.012Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M38.4449 36.6113L34.9407 33.4922C33.4015 35.2263 31.5287 36.6324 29.4338 37.6261L31.4503 41.8703C34.1095 40.6018 36.4877 38.8135 38.4449 36.6113Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M12.3958 41.7982C15.0483 43.0874 17.9341 43.8271 20.8798 43.9726L21.1224 39.2651C18.8113 39.1499 16.5473 38.5667 14.4682 37.5508L12.3958 41.7982Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M0.590332 27.0747C1.26671 29.9357 2.51222 32.6312 4.25267 35.0006L7.98977 32.3144C6.63643 30.4373 5.67844 28.305 5.17367 26.0469L0.590332 27.0747Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M0.754639 16.2713L5.39386 17.5715C6.0175 15.342 7.08687 13.2622 8.53725 11.4578L4.71119 8.39355C2.87254 10.7246 1.52666 13.4045 0.754639 16.2713Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M15.2892 6.33482C17.4211 5.42957 19.6893 4.97123 22.0309 4.97123V1.73398e-05H21.9996C19.0267 -0.00372174 16.084 0.597287 13.3506 1.76644L15.2892 6.33482Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M22.0001 0.382312C33.9012 0.397969 43.5363 10.0588 43.5203 21.9602C43.5043 33.8615 33.844 43.4965 21.9427 43.4805C10.0414 43.4645 0.406398 33.8041 0.422334 21.9028C0.433938 13.2522 5.61705 5.44712 13.5857 2.08092C16.2474 0.954321 19.1095 0.376498 22.0001 0.382312ZM22.0001 0C9.84877 0 0 9.84855 0 21.9998C0 34.1513 9.84877 44 22.0001 44C34.1513 44 44 34.1504 44 21.9998C44 9.8494 34.1504 0 22.0001 0Z"
									fill="url(#paint1_linear_326_7184)"
								/>
								<defs>
									<linearGradient id="paint0_linear_326_7184" x1="21.9997" y1="8.4834" x2="21.9997" y2="75.5169" gradientUnits="userSpaceOnUse">
										<stop stop-color={getChipColor(activeChipValue)} />
										<stop offset="1" stop-color="rgba(0,0,0,0.122)" />
									</linearGradient>
									<linearGradient id="paint1_linear_326_7184" x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
										<stop stop-color={getChipColor(activeChipValue)} />
										<stop offset="1" stop-color="#7B4285" />
									</linearGradient>
								</defs>
								<text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="black" className="text-[10px] font-bold tabular-nums" color="black">
									{activeChipValue >= 1000 ? `${(activeChipValue / 1000).toFixed(0)}k` : activeChipValue}
								</text>
							</svg>
						</div>
					</div>

					{/* Container 3: Botões de Ação */}
					<div className="w-full flex-col gap-y-2 flex items-center bg-[#131624] p-4 rounded-xl">
						<div className="flex gap-2 justify-center">
							<button
								type="button"
								onClick={undoLastBet}
								className="w-12 text-sm text-[var(--yellow)] font-semibold h-9 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center active:bg-[var(--bg-primary)] transition-all"
							>
								x2
							</button>
							<button
								type="button"
								onClick={cleanAllBets}
								className="text-sm px-2 text-[var(--yellow)] font-semibold h-9 w-20 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center gap-x-2 active:bg-[var(--bg-primary)] transition-all"
							>
								<img src={clearIcon} alt="Clear" />
								Clear
							</button>
							<button
								type="button"
								onClick={undoLastBet}
								className="text-sm text-[var(--yellow)] font-semibold h-9 w-20 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center gap-x-2 active:bg-[var(--bg-primary)] transition-all"
							>
								<img src={undoIcon} alt="Undo" />
								Undo
							</button>
						</div>
					</div>
				</>
			) : (
				// Desktop: Container único com tudo dentro
				<div className="md:flex-row md:justify-between gap-x-2 flex md:w-full items-center bg-[#131624] px-2 py-4 rounded-xl mt-6 md:px-6">
					<div className="md:w-fit flex flex-col items-center justify-start">
						<button
							disabled={isWheelWheelSpinning}
							type="button"
							className="w-full text-sm text-[var(--bg-sec)] h-14 rounded-lg border-[var(--border-primary)] border-default bg-[var(--yellow)] active:bg-[var(--yellow)] transition flex flex-col items-center justify-center mb-2 cursor-pointer"
						>
							<span className="whitespace-nowrap text-xs font-bold">Place BET</span>
							<span className="whitespace-nowrap text-xs font-bold">and</span>
							<span className="whitespace-nowrap text-xs font-bold tabular-nums">WIN 234k</span>
						</button>
						<button type="button" className="text-[10px] w-full text-white font-medium transition-all whitespace-nowrap px-4">
							+165k from signed bets
						</button>
					</div>
					<div className="md:w-fit flex items-center justify-center gap-x-2">
						<button
							type="button"
							onClick={undoLastBet}
							className="w-14 text-sm text-[var(--yellow)] font-semibold h-9 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center active:bg-[var(--bg-primary)] transition-all"
						>
							x2
						</button>
						<div className="flex w-full items-center justify-center">
							<div
								className="w-16 h-9 flex items-center justify-center bg-primary rounded-lg border-[var(--border-primary)] border-default cursor-pointer active:bg-[var(--bg-primary)] transition-all"
								onMouseDown={() => startIncrement('decrease')}
								onMouseUp={stopIncrement}
								onMouseLeave={stopIncrement}
								onClick={decreaseChipValue}
							>
								<img src={minusIcon} alt="Decrease" />
							</div>
							<div className="flex flex-col w-full max-w-56 mb-4">
								<div className="flex justify-between text-white text-[9px] md:text-xs mb-1 px-2">
									<span>1k</span>
									<span>5k</span>
									<span>10k</span>
									<span>50k</span>
									<span>100k</span>
								</div>
								<input
									type="range"
									min="1"
									max="100"
									step="1"
									value={activeChipValue / 1000}
									onChange={handleChipChange}
									className="h-[2px] appearance-none bg-[#3b3f51] cursor-pointer accent-[var(--yellow)]"
								/>
							</div>
							<div
								className="text-sm md:text-base uppercase text-white font-normal h-9 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-end gap-x-1 cursor-pointer active:bg-[var(--bg-primary)] transition-all text-nowrap w-28 px-2"
								onMouseDown={() => startIncrement('increase')}
								onMouseUp={stopIncrement}
								onMouseLeave={stopIncrement}
								onClick={increaseChipValue}
							>
								<span className="w-20 text-end">{formatChipValue(activeChipValue)} BET</span>
								<img src={plusIcon} alt="Increase" />
							</div>
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

							<svg width="50" height="50" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84973 34.1503 0 22 0C9.84973 0 0 9.84973 0 22C0 34.1503 9.84973 44 22 44Z" fill="#131624" />
								<path
									d="M21.9997 35.5169C29.4648 35.5169 35.5165 29.4654 35.5165 22.0001C35.5165 14.5351 29.4648 8.4834 21.9997 8.4834C14.5346 8.4834 8.48291 14.5351 8.48291 22.0001C8.48291 29.4654 14.5346 35.5169 21.9997 35.5169Z"
									fill="url(#paint0_linear_326_7184)"
								/>
								<path
									d="M22.0001 5.15533C31.2737 5.16753 38.7815 12.6955 38.7691 21.9693C38.7566 31.243 31.2291 38.7508 21.9554 38.7383C12.6816 38.7259 5.17385 31.1983 5.18627 21.9245C5.19531 15.1838 9.2341 9.10193 15.4434 6.47892C17.5175 5.60105 19.7477 5.1508 22.0001 5.15533ZM22.0001 4.85742C12.5315 4.85742 4.85718 12.5316 4.85718 22.0001C4.85718 31.4688 12.5315 39.1431 22.0001 39.1431C31.4686 39.1431 39.1429 31.4681 39.1429 22.0001C39.1429 12.5323 31.4679 4.85742 22.0001 4.85742Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M15.2892 6.33482C17.4211 5.42957 19.6893 4.97123 22.0309 4.97123V1.73398e-05H21.9996C19.0267 -0.00372174 16.084 0.597287 13.3506 1.76644L15.2892 6.33482Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M32.6837 2.76465L30.3953 6.89043C32.4248 8.01412 34.2072 9.53494 35.6361 11.3624L39.339 8.45828C37.5226 6.13552 35.2598 4.19966 32.6837 2.76465Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M39.3071 22.012C39.3079 23.3504 39.1542 24.6844 38.8489 25.9872L43.4145 27.0608C44.0874 24.1923 44.181 21.2186 43.6901 18.3135L39.0634 19.0968C39.226 20.0603 39.3074 21.0353 39.3071 22.012Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M38.4449 36.6113L34.9407 33.4922C33.4015 35.2263 31.5287 36.6324 29.4338 37.6261L31.4503 41.8703C34.1095 40.6018 36.4877 38.8135 38.4449 36.6113Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M12.3958 41.7982C15.0483 43.0874 17.9341 43.8271 20.8798 43.9726L21.1224 39.2651C18.8113 39.1499 16.5473 38.5667 14.4682 37.5508L12.3958 41.7982Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M0.590332 27.0747C1.26671 29.9357 2.51222 32.6312 4.25267 35.0006L7.98977 32.3144C6.63643 30.4373 5.67844 28.305 5.17367 26.0469L0.590332 27.0747Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M0.754639 16.2713L5.39386 17.5715C6.0175 15.342 7.08687 13.2622 8.53725 11.4578L4.71119 8.39355C2.87254 10.7246 1.52666 13.4045 0.754639 16.2713Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M15.2892 6.33482C17.4211 5.42957 19.6893 4.97123 22.0309 4.97123V1.73398e-05H21.9996C19.0267 -0.00372174 16.084 0.597287 13.3506 1.76644L15.2892 6.33482Z"
									fill={getChipColor(activeChipValue)}
								/>
								<path
									d="M22.0001 0.382312C33.9012 0.397969 43.5363 10.0588 43.5203 21.9602C43.5043 33.8615 33.844 43.4965 21.9427 43.4805C10.0414 43.4645 0.406398 33.8041 0.422334 21.9028C0.433938 13.2522 5.61705 5.44712 13.5857 2.08092C16.2474 0.954321 19.1095 0.376498 22.0001 0.382312ZM22.0001 0C9.84877 0 0 9.84855 0 21.9998C0 34.1513 9.84877 44 22.0001 44C34.1513 44 44 34.1504 44 21.9998C44 9.8494 34.1504 0 22.0001 0Z"
									fill="url(#paint1_linear_326_7184)"
								/>
								<defs>
									<linearGradient id="paint0_linear_326_7184" x1="21.9997" y1="8.4834" x2="21.9997" y2="75.5169" gradientUnits="userSpaceOnUse">
										<stop stop-color={getChipColor(activeChipValue)} />
										<stop offset="1" stop-color="rgba(0,0,0,0.122)" />
									</linearGradient>
									<linearGradient id="paint1_linear_326_7184" x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
										<stop stop-color={getChipColor(activeChipValue)} />
										<stop offset="1" stop-color="#7B4285" />
									</linearGradient>
								</defs>
								<text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="black" className="text-[10px] font-bold tabular-nums" color="black">
									{activeChipValue >= 1000 ? `${(activeChipValue / 1000).toFixed(0)}k` : activeChipValue}
								</text>
							</svg>
						</div>
					</div>
					<div className="md:w-fit flex gap-2 md:gap-3 justify-center">
						<button
							type="button"
							onClick={cleanAllBets}
							className="text-sm px-2 text-[var(--yellow)] font-semibold h-9 w-20 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center gap-x-2 active:bg-[var(--bg-primary)] transition-all"
						>
							<img src={clearIcon} alt="Clear" />
							Clear
						</button>
						<button
							type="button"
							onClick={undoLastBet}
							className="text-sm text-[var(--yellow)] font-semibold h-9 w-20 rounded-lg border-[var(--border-primary)] border-default bg-primary flex items-center justify-center gap-x-2 active:bg-[var(--bg-primary)] transition-all"
						>
							<img src={undoIcon} alt="Undo" />
							Undo
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default BetControls;
