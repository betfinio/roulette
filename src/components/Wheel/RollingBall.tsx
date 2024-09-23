import type React from 'react';
import './RollingBall.css';

interface RollingBallProps {
	size?: number;
	symbol?: string;
	speed?: number;
}

const RollingBall: React.FC<RollingBallProps> = ({ size = 200, symbol = '8', speed = 2 }) => {
	return (
		<div className="ball-container" style={{ width: size, height: size }}>
			<div className="ball" style={{ width: size, height: size }}>
				<div
					className="symbol"
					style={{
						animationDuration: `${speed}s`,
					}}
				>
					{symbol}
				</div>
			</div>
		</div>
	);
};

export default RollingBall;
