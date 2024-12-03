/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@betfinio/components/tailwind-config')],
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
			},

			animation: {
				wheel: 'rotate-wheel var(--spinningAnimationSpeed) linear infinite',
			},
			backgroundImage: {
				'roulette-center': "url('./assets/roulette-center.svg')",
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
