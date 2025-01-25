import preset from '@betfinio/components/tailwind-config';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [preset],
	darkMode: ['class'],
	important: '.roulette',
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				ring: 'hsl(var(--ring))',
				black: {
					roulette: 'hsl(var(--black-roulette))',
				},
				green: {
					roulette: 'hsl(var(--green-roulette))',
				},
				red: {
					roulette: 'hsl(var(--red-roulette))',
				},
			},
			keyframes: {
				'rotate-wheel': {
					'0%': { transform: 'rotateZ(0deg)' },
					'100%': { transform: 'rotateZ(360deg)' },
				},
				wiggle: {
					'0%': { opacity: 0.3 },
					'100%': { opacity: 1 },
				},
			},
			animation: {
				wheel: 'rotate-wheel var(--spinningAnimationSpeed) linear infinite',
				wiggle: '30s linear 10s wiggle infinite ',
			},
			backgroundImage: {
				'roulette-center': "url('./assets/roulette-center.svg')",
			},
		},
	},
	plugins: [animate],
};
