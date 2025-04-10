import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/games/roulette/')({
	component: RouletteRedirect,
});

function RouletteRedirect() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate({ to: '/games/roulette/live' });
	}, [navigate]);

	return null;
}
