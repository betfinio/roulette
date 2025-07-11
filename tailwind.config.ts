/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	important: '.roulette',
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				black: {
					roulette: 'var(--black-roulette)',
				},
				green: {
					roulette: 'var(--green-roulette)',
				},
				red: {
					roulette: 'var(--red-roulette)',
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
};
