import { ZeroAddress } from '@betfinio/abi';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentInterval } from '@/src/lib/live-roulette/query';
import { useVisibleTable } from '@/src/lib/shared/query';

export const BackToGame = () => {
	const { table = ZeroAddress } = useVisibleTable();
	const { data: interval } = useCurrentInterval(table);

	const navigate = useNavigate();

	const handleClick = async () => {
		const currentRound = interval ? Math.floor(Date.now() / 1000 / interval) : 0;
		await navigate({
			to: '/games/roulette/live/$table',
			params: {
				table: table || ZeroAddress,
			},
			search: { round: currentRound },
		});
	};

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 25" fill="none" className={'rl:border rl:border-primary rl:rounded-lg rl:w-full'}>
			<text
				id="timerText"
				x="50%"
				y="50%"
				textAnchor="middle"
				className="rl:fill-foreground rl:hover:fill-primary rl:text-xs rl:cursor-pointer"
				dy=".3em"
				onClick={handleClick}
			>
				Back To Game
			</text>
		</svg>
	);
};
