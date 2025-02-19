import { useGetLiveRouletteTables } from '@/src/lib/live-roulette/query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/games/roulette/live/')({
	component: IndexLiveRoulette,
});

export function IndexLiveRoulette() {
	const { data: tables = [] } = useGetLiveRouletteTables();
	const navigate = useNavigate();
	useEffect(() => {
		if (tables.length > 0) {
			navigate({ to: '/games/roulette/live/$table', params: { table: tables[tables.length - 1].address } });
		}
	}, [tables]);
	return <div>Loading...</div>;
}
