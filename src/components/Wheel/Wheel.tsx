import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import cashIcon from '../../assets/images/chip-betfin.svg';
import coinRainSoundFile from '../../assets/sounds/coin-rain.wav'; // Som de moedas caindo
import spinSoundFile from '../../assets/sounds/roulette-ball.wav'; // Som para rotação
import winSoundFile from '../../assets/sounds/win.wav'; // Som de vencedor
import { useWheel } from '../../contexts/WheelContext';
import './Wheel.css'; // Função para gerar os números da roleta europeia com alternância correta de cores

// Função para gerar os números da roleta europeia com alternância correta de cores
const getWheelNumbers = () => [
	'0',
	'32',
	'15',
	'19',
	'4',
	'21',
	'2',
	'25',
	'17',
	'34',
	'6',
	'27',
	'13',
	'36',
	'11',
	'30',
	'8',
	'23',
	'10',
	'5',
	'24',
	'16',
	'33',
	'1',
	'20',
	'14',
	'31',
	'9',
	'22',
	'18',
	'29',
	'7',
	'28',
	'12',
	'35',
	'3',
	'26',
];

// Função para obter a cor com base no número
const getNumberColor = (num: string) => {
	const greenNumbers = ['0'];
	const redNumbers = ['32', '19', '21', '25', '34', '27', '36', '30', '23', '5', '16', '1', '14', '9', '18', '7', '12', '3'];
	const blackNumbers = ['15', '4', '2', '17', '6', '13', '11', '8', '10', '24', '33', '20', '31', '22', '29', '28', '35', '26'];

	if (greenNumbers.includes(num)) return 'var(--green)';
	if (redNumbers.includes(num)) return 'var(--red)';
	if (blackNumbers.includes(num)) return 'var(--black)';
	return '';
};

// Função para lidar com classes dinâmicas
const classNames = (...classes: Array<unknown>) => {
	return classes.filter(Boolean).join(' ');
};

export const Wheel = () => {
	const { isWheelWheelSpinning, selectedNumber, handleDoSpin, stopSpin, setNumCoins } = useWheel();

	const [wheelNumbers, setWheelNumbers] = useState<string[]>([]);
	const [showWinnerMessage, setShowWinnerMessage] = useState(false);
	const innerRef = useRef<HTMLUListElement>(null);

	// Referências para os sons
	const spinSound = useRef<HTMLAudioElement | null>(null);
	const winSound = useRef<HTMLAudioElement | null>(null);
	const coinRainSound = useRef<HTMLAudioElement | null>(null);

	// Estados para os volumes
	const [spinVolume, setSpinVolume] = useState(1); // Volume inicial para o som da roleta
	const [winVolume, setWinVolume] = useState(0.1); // Volume inicial para o som de vencedor
	const [coinRainVolume, setCoinRainVolume] = useState(0.1); // Volume inicial para o som de moedas

	useEffect(() => {
		setWheelNumbers(getWheelNumbers());
	}, []);

	useEffect(() => {
		const currentInnerRef = innerRef.current;

		if (selectedNumber === '-1' || currentInnerRef === null || !isWheelWheelSpinning) {
			return;
		}

		// Iniciar som de rotação
		if (spinSound.current) {
			spinSound.current.currentTime = 0;
			spinSound.current.volume = spinVolume; // Aplicar o volume do som de rotação
			const spinDuration = 9; // 9 segundos, o tempo da rotação
			const originalDuration = spinSound.current.duration;
			if (originalDuration > 0) {
				spinSound.current.playbackRate = originalDuration / spinDuration; // Ajusta o som para caber no tempo
			}
			spinSound.current.play(); // Toca o som de rotação
		}

		currentInnerRef.classList.remove('rest');
		currentInnerRef.removeAttribute('data-spintoindex');
		const betIndex = wheelNumbers.indexOf(selectedNumber);

		setTimeout(() => {
			currentInnerRef.setAttribute('data-spintoindex', `${betIndex}`);

			setTimeout(() => {
				currentInnerRef.classList.add('rest');
				stopSpin();
				handleShowWinnerMessage(); // Ativa a mensagem de vencedor e a chuva de moedas
			}, 9000); // Tempo de rotação da roleta
		}, 100);
	}, [selectedNumber, isWheelWheelSpinning, wheelNumbers, stopSpin, spinVolume]);

	// Função para exibir e ocultar a tela de vencedor e controlar a chuva de moedas
	const handleShowWinnerMessage = () => {
		// Tocar som de vencedor
		if (winSound.current) {
			winSound.current.currentTime = 0;
			winSound.current.volume = winVolume; // Aplicar o volume do som de vencedor
			winSound.current.play();
		}

		// Tocar som de moedas
		if (coinRainSound.current) {
			coinRainSound.current.currentTime = 0;
			coinRainSound.current.volume = coinRainVolume; // Aplicar o volume do som de moedas
			coinRainSound.current.play();
		}

		setNumCoins(1);
		setShowWinnerMessage(true);

		// Desativa a mensagem de vencedor e a chuva de moedas após 2.2 segundos
		setTimeout(() => {
			setShowWinnerMessage(false);
		}, 2200);
	};

	// Quando a mensagem de vencedor é ocultada, desativar explicitamente a chuva de moedas
	useEffect(() => {
		if (!showWinnerMessage) {
			setTimeout(() => {
				setNumCoins(0); // Desativa a chuva de moedas após a mensagem desaparecer
				if (coinRainSound.current) {
					coinRainSound.current.pause(); // Parar o som de moedas
				}
			}, 300); // Adiciona um pequeno atraso para garantir a sincronização
		}
	}, [showWinnerMessage]);

	return (
		<div className="roulette-wheel-container -mt-24">
			{/* Div para a sombra com gradiente que escurece para cima */}
			<div
				className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
				style={{
					background: 'linear-gradient(to bottom, hsl(227, 32%, 9%), transparent)',
				}}
			/>
			<div className={classNames('mx-auto roulette-wheel-plate roulette-wheel-plate-with-animation', { 'with-animation': true })}>
				<ul className="roulette-wheel-inner" ref={innerRef}>
					{wheelNumbers.map((number) => (
						<li
							key={`wheel-${number}`}
							data-bet={number}
							className="roulette-wheel-bet-number"
							style={{ borderTopColor: getNumberColor(number) }} // Definir cor dinamicamente
						>
							<label htmlFor={`wheel-pit-${number}`}>
								<input
									type="radio"
									name="pit"
									id={`wheel-pit-${number}`}
									defaultValue={number}
									onChange={() => handleDoSpin(number)} // Iniciar o spin com o número selecionado
									disabled={isWheelWheelSpinning} // Desabilitar durante a rotação
								/>
								<span className="roulette-wheel-pit">{number}</span>
							</label>
						</li>
					))}
				</ul>
			</div>

			{/* Sons */}
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={spinSound} src={spinSoundFile} />
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={winSound} src={winSoundFile} />
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio ref={coinRainSound} src={coinRainSoundFile} />

			{/* Tela de mensagem de vencedor com animação */}
			<AnimatePresence>
				{showWinnerMessage && (
					<motion.div
						key="winnerMessage"
						className="absolute w-full flex flex-col items-center justify-center text-center text-white z-20 top-1/2 text-5xl"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1.2 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3, stiffness: 500 }}
					>
						<h2 className="font-semibold z-30 text-white text-2xl">You win:</h2>
						<span className="font-semibold flex items-center gap-x-1 z-30 text-[var(--yellow)] text-2xl tabular-nums">
							{/* {selectedNumber} */}
							200,000 <img src={cashIcon} className="h-6" alt="" />
						</span>
						<div className="absolute h-40 w-40 rounded-full blur-xl opacity-70 bg-[var(--blue-shiny)] z-10" />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Wheel;
