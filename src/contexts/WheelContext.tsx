import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

interface WheelContextProps {
	isWheelWheelSpinning: boolean;
	handleDoSpin: (betNumber: string) => void;
	totalBet: number;
	betHistory: string[];
	activeChipValue: number;
	setActiveChipValue: (value: number | ((prevValue: number) => number)) => void;
	undoLastBet: () => void;
	cleanAllBets: () => void;
	placeChip: (number: number | string, position: string, relatedNumbers: number[]) => void;

	changeIsDebug: () => void;
	isAmerican: boolean;
	isVertical: boolean;
	isMobile: boolean;
	isTablet: boolean;
	isDebugMode: boolean;
	selectedNumber: string;
	setSelectedNumber: (number: string) => void;
	startSpin: () => void;
	stopSpin: () => void;
	placedChips: {
		number: number | string;
		value: number;
		position: string;
		relatedNumbers: number[];
	}[];
	// Estados para controlar o CoinRainEffect
	isRainActive: boolean;
	setRainActive: (isActive: boolean) => void;
	numCoins: number;
	setNumCoins: (value: number) => void;
	rainIntensity: number;
	setRainIntensity: (intensity: number) => void;
	fallingSpeed: number;
	setFallingSpeed: (speed: number) => void;
	rotationSpeed: number;
	setRotationSpeed: (speed: number) => void;
	resizeFactor: number;
	setResizeFactor: (factor: number) => void;
}

const WheelContext = createContext<WheelContextProps | undefined>(undefined);

interface WheelProviderProps {
	children: ReactNode;
}

export const WheelProvider: React.FC<WheelProviderProps> = ({ children }) => {
	const [isWheelWheelSpinning, setIsWheelWheelSpinning] = useState(false);
	const [betHistory, setBetHistory] = useState<string[]>([]);
	const [totalBet, setTotalBet] = useState(0);
	const [activeChipValue, setActiveChipValue] = useState(1000);
	const [isDebugMode, setIsDebugMode] = useState(false);
	const [selectedNumber, setSelectedNumber] = useState('');
	const [placedChips, setPlacedChips] = useState<
		{
			number: number | string;
			value: number;
			position: string;
			relatedNumbers: number[];
		}[]
	>([]);

	// Estados para controlar o CoinRainEffect
	const [isRainActive, setRainActive] = useState(true);
	const [numCoins, setNumCoins] = useState<number>(0);
	const [rainIntensity, setRainIntensity] = useState(0.2);
	const [fallingSpeed, setFallingSpeed] = useState(8);
	const [rotationSpeed, setRotationSpeed] = useState(5);
	const [resizeFactor, setResizeFactor] = useState(0.3);
	const [isAmerican, setIsAmerican] = useState(false);

	// Detectar quando a largura da tela é menor que 1024px
	const isMobile = useMediaQuery({ query: '(max-width: 639px)' });
	// Estado inicial de isVertical
	const [isVertical, setIsVertical] = useState(isMobile);

	const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });

	// Efeito para atualizar o isVertical quando a largura da tela muda
	useEffect(() => {
		setIsVertical(isMobile);
	}, [isMobile]);

	const handleDoSpin = (betNumber: string) => {
		setSelectedNumber(betNumber);
		setBetHistory((prev) => [...prev, `Bet placed on number ${betNumber}`]);
		startSpin();
	};

	const startSpin = () => setIsWheelWheelSpinning(true);

	const stopSpin = () => setIsWheelWheelSpinning(false);

	const undoLastBet = () => {
		if (placedChips.length > 0) {
			const lastChip = placedChips.pop();
			setTotalBet(totalBet - (lastChip?.value || 0));
			setPlacedChips([...placedChips]);
			betHistory.pop();
			setBetHistory([...betHistory]);
		}
	};

	const cleanAllBets = () => {
		setPlacedChips([]);
		setTotalBet(0);
		setBetHistory([]);
	};

	const placeChip = (number: number | string, position: string, relatedNumbers: number[]) => {
		const newChip = {
			number,
			value: activeChipValue,
			position,
			relatedNumbers,
		};
		setPlacedChips([...placedChips, newChip]);
		setTotalBet(totalBet + activeChipValue);
		setBetHistory([...betHistory, `Aposta em ${number} (${position} - ${relatedNumbers.join(', ')}): ${activeChipValue}`]);
	};

	const changeIsDebug = () => setIsDebugMode((prev) => !prev);

	return (
		<WheelContext.Provider
			value={{
				numCoins,
				setNumCoins,
				isWheelWheelSpinning,
				handleDoSpin,
				totalBet,
				betHistory,
				activeChipValue,
				setActiveChipValue,
				undoLastBet,
				cleanAllBets,
				placeChip,

				changeIsDebug,
				isAmerican,
				isVertical,
				isMobile,
				isTablet,
				isDebugMode,
				selectedNumber,
				setSelectedNumber,
				startSpin,
				stopSpin,
				placedChips,
				isRainActive,
				setRainActive,
				rainIntensity,
				setRainIntensity,
				fallingSpeed,
				setFallingSpeed,
				rotationSpeed,
				setRotationSpeed,
				resizeFactor,
				setResizeFactor,
			}}
		>
			{children}
		</WheelContext.Provider>
	);
};

export const useWheel = () => {
	const context = useContext(WheelContext);
	if (!context) {
		throw new Error('useWheel must be used within a WheelProvider');
	}
	return context;
};
