export const SLIDE_DOWN_ANIMATION = {
	initial: { opacity: 0, y: -20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 20 },
	transition: { duration: 0.5 },
} as const;
