/** @type {import('tailwindcss').Config} */
module.exports = {
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
				'accent-secondary': {
					DEFAULT: 'hsl(var(--accent-secondary))',
					foreground: 'hsl(var(--accent-secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				'card-secondary': {
					DEFAULT: 'hsl(var(--card-secondary))',
					foreground: 'hsl(var(--card-secondary-foreground))',
				},
				tertiary: {
					DEFAULT: 'hsl(var(--tertiary))',
					foreground: 'hsl(var(--tertiary-foreground))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				bonus: {
					DEFAULT: 'hsl(var(--bonus))',
				},
			},
			keyframes: {
				'rotate-wheel': {
					'0%': { transform: 'rotateZ(0deg)' },
					'100%': { transform: 'rotateZ(360deg)' },
				},
			},
			fontFamily: {
				sans: ['Rubik', 'sans-serif'],
			},
			animation: {
				wheel: 'rotate-wheel var(--spinningAnimationSpeed) linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
