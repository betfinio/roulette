import { useRef } from 'react';
import coinRainSoundFile from '../../../assets/sounds/coin-rain.wav'; // Coin rain sound
import spinSoundFile from '../../../assets/sounds/roulette-ball.wav'; // Spin sound
import winSoundFile from '../../../assets/sounds/win.wav'; // Win sound
export const Sounds = () => {
	// Sound references
	const spinSound = useRef<HTMLAudioElement | null>(null);
	const winSound = useRef<HTMLAudioElement | null>(null);
	const coinRainSound = useRef<HTMLAudioElement | null>(null);
	return (
		<>
			<audio ref={spinSound} src={spinSoundFile} />
			<audio ref={winSound} src={winSoundFile} />
			<audio ref={coinRainSound} src={coinRainSoundFile} />
		</>
	);
};
