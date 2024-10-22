import type React from 'react';
import { useEffect, useRef, useState } from 'react';
// import dat from "dat.gui"; don't remove, used in debug mode
import coinImage1 from '../../assets/images/coin-side-1.png';
import coinImage2 from '../../assets/images/coin-side-2.png';
import coinImage3 from '../../assets/images/coin-side-3.png';
import coinImage4 from '../../assets/images/coin-side-4.png';

interface Coin {
	vitesseX: number;
	vitesseY: number;
	X: number;
	Y: number;
	alpha: number;
	rotation: number;
	rotationSpeed: number;
	image: HTMLImageElement;
	width: number;
	height: number;
}

const CoinRainEffect: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [width, setWidth] = useState<number>(window.innerWidth);
	const [height, setHeight] = useState<number>(window.innerHeight);
	const [coinImages, setCoinImages] = useState<HTMLImageElement[]>([]);
	const coinsRef = useRef<Coin[]>([]); // Usar ref para persistir moedas
	const requestIdRef = useRef<number | null>(null); // Usar ref para controlar animação

	const numCoins = 100;
	const fallingSpeed = 0.02;
	const rotationSpeed = 1;
	const resizeFactor = 1;

	useEffect(() => {
		if (canvasRef.current) {
			const context = canvasRef.current.getContext('2d');
			if (context) {
				setCtx(context);
			}
		}

		const handleResize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = width;
			canvas.height = height;
		}
	}, [width, height]);

	useEffect(() => {
		const loadImages = () => {
			const images = [coinImage1, coinImage2, coinImage3, coinImage4].map((src) => {
				const img = new Image();
				img.src = src;
				return img;
			});
			setCoinImages(images);
		};
		loadImages();
	}, []);

	const getRandomCoinImage = () => {
		const randomIndex = Math.floor(Math.random() * coinImages.length);
		return coinImages[randomIndex];
	};

	// Função para adicionar novas moedas ao array sem remover as existentes
	const dropCoin = (X: number, Y: number) => {
		const newCoins = [];
		for (let i = 0; i < numCoins; i++) {
			const offsetX = Math.random() * 50 - 25;
			const offsetY = Math.random() * 50 - 25;
			const coinImage = getRandomCoinImage();
			const resizedWidth = coinImage.width * resizeFactor;
			const resizedHeight = coinImage.height * resizeFactor;

			newCoins.push({
				vitesseX: Math.random() * 0.15,
				vitesseY: Math.random() * 4 + 1,
				X: X + offsetX,
				Y: Y + offsetY,
				alpha: 1,
				rotation: 0,
				rotationSpeed: (Math.random() * 2 - 1) * rotationSpeed,
				image: coinImage,
				width: resizedWidth,
				height: resizedHeight,
			});
		}
		coinsRef.current = [...coinsRef.current, ...newCoins]; // Atualizar o array de moedas
	};

	const render = () => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		ctx.globalAlpha = 1;

		// Iterar sobre as moedas e renderizá-las
		for (const coin of coinsRef.current) {
			ctx.save();
			ctx.translate(coin.X + coin.width / 2, coin.Y + coin.height / 2);
			ctx.rotate((coin.rotation * Math.PI) / 180);
			ctx.drawImage(coin.image, -coin.width / 2, -coin.height / 2, coin.width, coin.height);
			ctx.restore();

			coin.X += coin.vitesseX;
			coin.Y += coin.vitesseY + fallingSpeed;
			coin.rotation += coin.rotationSpeed;

			// Remover a moeda se sair da tela
			if (coin.Y > height) {
				coinsRef.current.splice(coinsRef.current.indexOf(coin), 1);
			}
		}
	};

	const update = () => {
		if (numCoins > 0) {
			dropCoin(Math.floor(Math.random() * width), -50);
		}
	};

	const animate = () => {
		if (!ctx) return;
		update();
		render();
		requestIdRef.current = requestAnimationFrame(animate);
	};

	// Iniciar a animação quando as imagens das moedas estiverem carregadas
	useEffect(() => {
		if (coinImages.length > 0 && ctx) {
			requestIdRef.current = requestAnimationFrame(animate);
		}

		return () => {
			if (requestIdRef.current) {
				cancelAnimationFrame(requestIdRef.current); // Cancelar a animação ao desmontar
			}
		};
	}, [coinImages, ctx, width, height, fallingSpeed, rotationSpeed, resizeFactor, numCoins]);

	return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none" />;
};

export default CoinRainEffect;
