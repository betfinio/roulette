import type React from 'react';
import { useState } from 'react';
import './Racetrack.css';
import { useWheel } from '../../contexts/WheelContext';
import TableItem from '../TableGrid/TableItem';
import { racetrackConfig } from './racetrackConfig';

// Define colors for numbers
const colorMapping: { [key: number]: string } = {
	1: 'var(--red)',
	2: 'var(--black)',
	3: 'var(--red)',
	4: 'var(--black)',
	5: 'var(--red)',
	6: 'var(--black)',
	7: 'var(--red)',
	8: 'var(--black)',
	9: 'var(--red)',
	10: 'var(--black)',
	11: 'var(--black)',
	12: 'var(--red)',
	13: 'var(--black)',
	14: 'var(--red)',
	15: 'var(--black)',
	16: 'var(--red)',
	17: 'var(--black)',
	18: 'var(--red)',
	19: 'var(--red)',
	20: 'var(--black)',
	21: 'var(--red)',
	22: 'var(--black)',
	23: 'var(--red)',
	24: 'var(--black)',
	25: 'var(--red)',
	26: 'var(--black)',
	27: 'var(--red)',
	28: 'var(--black)',
	29: 'var(--black)',
	30: 'var(--red)',
	31: 'var(--black)',
	32: 'var(--red)',
	33: 'var(--black)',
	34: 'var(--red)',
	35: 'var(--black)',
	36: 'var(--red)',
	0: 'var(--green)',
};

const Racetrack: React.FC = () => {
	const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);
	const { placeChip, isDebugMode, getChipColor, placedChips } = useWheel();

	const handleHoverNumbers = (numbers: number[]) => setHoveredNumbers(numbers);
	const handleLeaveHover = () => setHoveredNumbers([]);
	const isNumberHovered = (number: number) => hoveredNumbers.includes(number);

	// Numbers on the racetrack
	const numbersTop = [24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35];
	const numbersBottom = [30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
	const numbersLeft = [5, 10, 23, 8];
	const numbersRight = [3, 26, 0];

	return (
		<div className="w-full h-32 flex items-center justify-start">
			{/* Left Corner */}
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg width="44" height="86" viewBox="0 0 41 80" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					className={`${numbersLeft.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M12.4733 13.7767C11.6739 13.0144 10.4036 13.0414 9.68226 13.8779C4.18729 20.2497 0.840928 28.1946 0.121222 36.5778C0.0267396 37.6783 0.894861 38.606 1.99873 38.6453L23.593 39.4158C24.6968 39.4552 25.6095 38.5875 25.8014 37.4997C26.1764 35.3745 27.0248 33.3601 28.2834 31.607C28.9276 30.7097 28.9108 29.4505 28.1114 28.6883L12.4733 13.7767Z"
					fill="#1E292E"
				/>
				<path
					className={`${numbersLeft.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M39.9745 2C39.9745 0.895433 39.0784 -0.00521583 37.9752 0.0499767C30.5221 0.422853 23.3205 2.87397 17.1875 7.12522C16.2797 7.75448 16.119 9.01482 16.7928 9.89004L29.9747 27.0115C30.6485 27.8867 31.899 28.0361 32.8591 27.49C34.4407 26.5904 36.1789 25.9988 37.9809 25.7467C39.0748 25.5937 39.9745 24.7126 39.9745 23.608V2Z"
					fill="#DD375F"
				/>
				<path
					className={`${numbersLeft.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M2.07457 42.7561C0.972908 42.8362 0.139625 43.7953 0.274678 44.8916C1.21469 52.5221 4.33481 59.7216 9.26009 65.6249C9.96772 66.4731 11.2374 66.5208 12.0491 65.7717L27.9284 51.1172C28.7401 50.3681 28.7774 49.1093 28.148 48.2016C27.0653 46.6404 26.3023 44.8798 25.9033 43.0223C25.6714 41.9423 24.7273 41.1089 23.6257 41.189L2.07457 42.7561Z"
					fill="#DD375F"
				/>
				<path
					className={`${numbersLeft.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M15.684 69.2224C14.9779 70.0718 15.0913 71.3373 15.975 72C22.3952 76.8153 30.1177 79.5884 38.1346 79.9573C39.238 80.0081 40.1305 79.1039 40.1261 77.9994L40.0399 56.3915C40.0355 55.287 39.1323 54.4094 38.0378 54.2608C36.0363 53.989 34.1138 53.2986 32.3967 52.2351C31.4576 51.6535 30.2024 51.756 29.4964 52.6054L15.684 69.2224Z"
					fill="#1E292E"
				/>
				<path
					d="M33.1258 65.06C33.7238 65.2333 34.2091 65.541 34.5818 65.983C34.9544 66.425 35.1408 66.9407 35.1408 67.53C35.1408 68.0153 34.9978 68.466 34.7118 68.882C34.4258 69.298 34.0054 69.6317 33.4508 69.883C32.9048 70.1343 32.2548 70.26 31.5008 70.26C30.7468 70.26 30.0924 70.1343 29.5378 69.883C28.9918 69.6317 28.5758 69.298 28.2898 68.882C28.0038 68.466 27.8608 68.0153 27.8608 67.53C27.8608 66.9147 28.0471 66.3947 28.4198 65.97C28.8011 65.5367 29.2864 65.2333 29.8758 65.06V64.93C29.4164 64.7653 29.0524 64.5097 28.7838 64.163C28.5151 63.8163 28.3808 63.422 28.3808 62.98C28.3808 62.564 28.5021 62.1783 28.7448 61.823C28.9961 61.459 29.3558 61.173 29.8238 60.965C30.2918 60.7483 30.8508 60.64 31.5008 60.64C32.1508 60.64 32.7098 60.7483 33.1778 60.965C33.6458 61.173 34.0011 61.459 34.2438 61.823C34.4951 62.1783 34.6208 62.564 34.6208 62.98C34.6208 63.4133 34.4864 63.8077 34.2178 64.163C33.9491 64.5097 33.5851 64.7653 33.1258 64.93V65.06ZM31.5008 62.07C31.0674 62.07 30.7208 62.1783 30.4608 62.395C30.2008 62.6117 30.0708 62.8717 30.0708 63.175C30.0708 63.487 30.1964 63.7513 30.4478 63.968C30.6991 64.176 31.0501 64.3277 31.5008 64.423C31.9514 64.3277 32.3024 64.176 32.5538 63.968C32.8051 63.7513 32.9308 63.487 32.9308 63.175C32.9308 62.8717 32.8008 62.6117 32.5408 62.395C32.2894 62.1783 31.9428 62.07 31.5008 62.07ZM31.5008 68.83C32.1248 68.83 32.6058 68.6957 32.9438 68.427C33.2818 68.1497 33.4508 67.8073 33.4508 67.4C33.4508 67.0187 33.2774 66.685 32.9308 66.399C32.5928 66.1043 32.1161 65.9137 31.5008 65.827C30.8941 65.9137 30.4174 66.1043 30.0708 66.399C29.7241 66.685 29.5508 67.0187 29.5508 67.4C29.5508 67.8073 29.7198 68.1497 30.0578 68.427C30.3958 68.6957 30.8768 68.83 31.5008 68.83Z"
					fill="white"
				/>
				<path
					d="M31.8242 12.28C32.4222 12.28 32.9639 12.4143 33.4492 12.683C33.9346 12.943 34.3159 13.3027 34.5932 13.762C34.8706 14.2127 35.0092 14.7153 35.0092 15.27C35.0092 15.8593 34.8662 16.3793 34.5802 16.83C34.3029 17.2807 33.8956 17.6317 33.3582 17.883C32.8209 18.1343 32.1796 18.26 31.4342 18.26C30.8362 18.26 30.2772 18.1517 29.7572 17.935C29.2459 17.7097 28.8429 17.4193 28.5482 17.064C28.2622 16.7173 28.1192 16.401 28.1192 16.115C28.1192 15.8897 28.1929 15.7033 28.3402 15.556C28.4876 15.4087 28.6739 15.335 28.8992 15.335C29.0379 15.335 29.1679 15.374 29.2892 15.452C29.4106 15.5213 29.5492 15.6513 29.7052 15.842C29.9826 16.1627 30.2599 16.388 30.5372 16.518C30.8232 16.6393 31.1656 16.7 31.5642 16.7C32.1016 16.7 32.5262 16.5657 32.8382 16.297C33.1589 16.0197 33.3192 15.6773 33.3192 15.27C33.3192 14.8627 33.1589 14.5247 32.8382 14.256C32.5262 13.9787 32.1016 13.84 31.5642 13.84C31.3302 13.84 31.1092 13.8617 30.9012 13.905C30.7019 13.9397 30.4766 14.0047 30.2252 14.1C30.0346 14.1693 29.8829 14.2213 29.7702 14.256C29.6576 14.282 29.5406 14.295 29.4192 14.295C29.1852 14.295 28.9859 14.2213 28.8212 14.074C28.6566 13.918 28.5742 13.7317 28.5742 13.515V9.68C28.5742 9.472 28.6522 9.29 28.8082 9.134C28.9642 8.978 29.1679 8.9 29.4192 8.9H33.8392C34.0906 8.9 34.2942 8.978 34.4502 9.134C34.6062 9.29 34.6842 9.472 34.6842 9.68C34.6842 9.888 34.6062 10.07 34.4502 10.226C34.2942 10.382 34.0906 10.46 33.8392 10.46H30.2642V12.54C30.6889 12.3667 31.2089 12.28 31.8242 12.28Z"
					fill="white"
				/>
				<path
					d="M12.6909 53.44C12.9422 53.44 13.1459 53.518 13.3019 53.674C13.4579 53.83 13.5359 54.012 13.5359 54.22C13.5359 54.428 13.4579 54.61 13.3019 54.766C13.1459 54.922 12.9422 55 12.6909 55H7.49086C7.25686 55 7.05753 54.9263 6.89286 54.779C6.72819 54.623 6.64586 54.4367 6.64586 54.22C6.64586 53.8127 6.84086 53.466 7.23086 53.18C8.26219 52.426 9.21119 51.6807 10.0779 50.944C10.5459 50.5453 10.9359 50.1293 11.2479 49.696C11.5599 49.2627 11.7159 48.8857 11.7159 48.565C11.7159 48.1663 11.5729 47.8413 11.2869 47.59C11.0009 47.33 10.6022 47.2 10.0909 47.2C9.72686 47.2 9.41486 47.265 9.15486 47.395C8.89486 47.525 8.63053 47.7417 8.36186 48.045C8.17986 48.2443 8.03253 48.383 7.91986 48.461C7.80719 48.5303 7.68586 48.565 7.55586 48.565C7.33053 48.565 7.14419 48.4913 6.99686 48.344C6.84953 48.1967 6.77586 48.0103 6.77586 47.785C6.77586 47.4903 6.89719 47.1957 7.13986 46.901C7.42586 46.537 7.82886 46.238 8.34886 46.004C8.87753 45.7613 9.45819 45.64 10.0909 45.64C10.7669 45.64 11.3562 45.7657 11.8589 46.017C12.3615 46.2683 12.7429 46.615 13.0029 47.057C13.2715 47.499 13.4059 48.0017 13.4059 48.565C13.4059 49.4577 12.8165 50.45 11.6379 51.542C10.9965 52.1487 10.2209 52.7337 9.31086 53.297V53.44H12.6909ZM18.293 49.67C18.8477 49.7133 19.3417 49.8607 19.775 50.112C20.2084 50.3633 20.5464 50.6883 20.789 51.087C21.0317 51.4857 21.153 51.9233 21.153 52.4C21.153 52.9287 21.01 53.4097 20.724 53.843C20.438 54.2763 20.0264 54.623 19.489 54.883C18.9517 55.1343 18.3147 55.26 17.578 55.26C16.9887 55.26 16.4297 55.1473 15.901 54.922C15.381 54.6967 14.965 54.3977 14.653 54.025C14.393 53.7043 14.263 53.401 14.263 53.115C14.263 52.8897 14.3367 52.7033 14.484 52.556C14.6314 52.4087 14.8177 52.335 15.043 52.335C15.1817 52.335 15.3074 52.3697 15.42 52.439C15.5414 52.5083 15.68 52.6383 15.836 52.829C16.1134 53.1497 16.395 53.375 16.681 53.505C16.967 53.635 17.3094 53.7 17.708 53.7C18.0634 53.7 18.371 53.6393 18.631 53.518C18.8997 53.3967 19.1034 53.2363 19.242 53.037C19.3894 52.8377 19.463 52.6253 19.463 52.4C19.463 52.1747 19.3894 51.9623 19.242 51.763C19.1034 51.5637 18.8997 51.4033 18.631 51.282C18.371 51.1607 18.0634 51.1 17.708 51.1H16.798C16.564 51.1 16.3647 51.0263 16.2 50.879C16.0354 50.723 15.953 50.5367 15.953 50.32C15.953 50.164 15.992 50.008 16.07 49.852C16.1567 49.6873 16.2694 49.54 16.408 49.41L18.358 47.59V47.46H15.368C15.1167 47.46 14.913 47.382 14.757 47.226C14.601 47.07 14.523 46.888 14.523 46.68C14.523 46.472 14.601 46.29 14.757 46.134C14.913 45.978 15.1167 45.9 15.368 45.9H19.983C20.217 45.9 20.4164 45.978 20.581 46.134C20.7457 46.2813 20.828 46.4633 20.828 46.68C20.828 47.0093 20.698 47.291 20.438 47.525L18.293 49.54V49.67Z"
					fill="white"
				/>
				<path
					d="M11.0591 25.77C11.2931 25.77 11.4924 25.848 11.6571 26.004C11.8217 26.1513 11.9041 26.3333 11.9041 26.55V34.35C11.9041 34.5667 11.8217 34.753 11.6571 34.909C11.4924 35.0563 11.2931 35.13 11.0591 35.13C10.8251 35.13 10.6257 35.0563 10.4611 34.909C10.2964 34.753 10.2141 34.5667 10.2141 34.35V28.565H10.0841L9.23906 29.41C9.0744 29.5747 8.92706 29.6917 8.79706 29.761C8.66706 29.8303 8.51106 29.865 8.32906 29.865C8.07773 29.865 7.86973 29.787 7.70506 29.631C7.54906 29.475 7.47106 29.2887 7.47106 29.072C7.47106 28.8033 7.58373 28.5693 7.80906 28.37L10.2141 26.186C10.3701 26.0387 10.5131 25.9347 10.6431 25.874C10.7817 25.8047 10.9204 25.77 11.0591 25.77ZM17.295 35.26C16.593 35.26 15.969 35.117 15.423 34.831C14.8857 34.5363 14.4653 34.1333 14.162 33.622C13.8673 33.1107 13.72 32.53 13.72 31.88V29.02C13.72 28.37 13.8673 27.7893 14.162 27.278C14.4653 26.7667 14.8857 26.368 15.423 26.082C15.969 25.7873 16.593 25.64 17.295 25.64C17.997 25.64 18.6167 25.7873 19.154 26.082C19.7 26.368 20.1203 26.7667 20.415 27.278C20.7183 27.7893 20.87 28.37 20.87 29.02V31.88C20.87 32.53 20.7183 33.1107 20.415 33.622C20.1203 34.1333 19.7 34.5363 19.154 34.831C18.6167 35.117 17.997 35.26 17.295 35.26ZM17.295 33.7C17.8757 33.7 18.335 33.5353 18.673 33.206C19.011 32.8767 19.18 32.4347 19.18 31.88V29.02C19.18 28.4653 19.011 28.0233 18.673 27.694C18.335 27.3647 17.8757 27.2 17.295 27.2C16.7143 27.2 16.255 27.3647 15.917 27.694C15.579 28.0233 15.41 28.4653 15.41 29.02V31.88C15.41 32.4347 15.579 32.8767 15.917 33.206C16.255 33.5353 16.7143 33.7 17.295 33.7Z"
					fill="white"
				/>
			</svg>

			{/* Central Tracks */}
			<div className="flex flex-col">
				{/* Top numbers */}
				<div className="flex justify-center mx-1 gap-x-1">
					{numbersTop.map((num) => (
						<div
							key={num}
							className={`w-[28px] h-[28px] flex items-center justify-center text-xs rounded-md ${isNumberHovered(num) ? 'number-hovered' : ''}`}
							style={{ backgroundColor: colorMapping[num], color: 'white' }}
						>
							{num}
						</div>
					))}
				</div>
				{/* Central area with labels */}
				<div className="relative w-full flex items-center justify-center">
					{/* Labels */}
					<div className="w-full flex items-center justify-between gap-4 z-10 py-2 pl-8">
						{Object.keys(racetrackConfig).map((strategy) => (
							<TableItem
								key={strategy}
								number={strategy}
								isVertical={false}
								isRangeButton={true}
								centerSelection={racetrackConfig[strategy].centerSelection}
								onHoverNumbers={handleHoverNumbers}
								onLeaveHover={handleLeaveHover}
								isDebugMode={isDebugMode}
								placedChips={placedChips.filter((chip) => chip.number === strategy)}
								getChipColor={getChipColor}
								onClick={(position: string, relatedNumbers: number[]) => placeChip(strategy, position, relatedNumbers)}
								className={`racetrack-label ${racetrackConfig[strategy].className}`}
							/>
						))}
					</div>

					{/* SVG lines */}
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg className="absolute w-full h-auto z-0" width="475" height="31" viewBox="0 0 475 31" fill="none" xmlns="http://www.w3.org/2000/svg">
						<line x1="94.2122" y1="0.547271" x2="158.212" y2="30.5473" stroke="#9999AD" />
						<line x1="253.798" y1="1" x2="253.798" y2="31" stroke="#9999AD" />
						<line x1="413.5" y1="1" x2="413.5" y2="31" stroke="#9999AD" />
					</svg>
				</div>
				{/* Bottom numbers */}
				<div className="flex justify-center gap-x-1">
					{numbersBottom.map((num) => (
						<div
							key={num}
							className={`w-[28px] h-[28px] flex items-center justify-center text-xs rounded-md ${isNumberHovered(num) ? 'number-hovered' : ''}`}
							style={{ backgroundColor: colorMapping[num], color: 'white' }}
						>
							{num}
						</div>
					))}
				</div>
			</div>

			{/* Right Corner */}
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
			<svg width="44" height="85" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					className={`${numbersRight.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M30.8052 17.7504C31.7006 17.1036 31.9061 15.8499 31.2154 14.9879C27.6951 10.5945 23.2819 6.98752 18.2595 4.41075C13.2371 1.83398 7.7332 0.352857 2.11125 0.0557396C1.00822 -0.00255478 0.109652 0.895577 0.106559 2.00014L0.0460136 23.6081C0.0429198 24.7126 0.940121 25.5963 2.03361 25.7524C3.6107 25.9775 5.14419 26.4635 6.56982 27.195C7.99546 27.9264 9.28468 28.8886 10.3874 30.0383C11.1519 30.8356 12.393 31.049 13.2884 30.4022L30.8052 17.7504Z"
					fill="#DD375F"
				/>
				<path
					d="M13.4845 13.67C14.0391 13.7133 14.5331 13.8607 14.9665 14.112C15.3998 14.3633 15.7378 14.6883 15.9805 15.087C16.2231 15.4857 16.3445 15.9233 16.3445 16.4C16.3445 16.9287 16.2015 17.4097 15.9155 17.843C15.6295 18.2763 15.2178 18.623 14.6805 18.883C14.1431 19.1343 13.5061 19.26 12.7695 19.26C12.1801 19.26 11.6211 19.1473 11.0925 18.922C10.5725 18.6967 10.1565 18.3977 9.84445 18.025C9.58445 17.7043 9.45445 17.401 9.45445 17.115C9.45445 16.8897 9.52812 16.7033 9.67545 16.556C9.82279 16.4087 10.0091 16.335 10.2345 16.335C10.3731 16.335 10.4988 16.3697 10.6115 16.439C10.7328 16.5083 10.8715 16.6383 11.0275 16.829C11.3048 17.1497 11.5865 17.375 11.8725 17.505C12.1585 17.635 12.5008 17.7 12.8995 17.7C13.2548 17.7 13.5625 17.6393 13.8225 17.518C14.0911 17.3967 14.2948 17.2363 14.4335 17.037C14.5808 16.8377 14.6545 16.6253 14.6545 16.4C14.6545 16.1747 14.5808 15.9623 14.4335 15.763C14.2948 15.5637 14.0911 15.4033 13.8225 15.282C13.5625 15.1607 13.2548 15.1 12.8995 15.1H11.9895C11.7555 15.1 11.5561 15.0263 11.3915 14.879C11.2268 14.723 11.1445 14.5367 11.1445 14.32C11.1445 14.164 11.1835 14.008 11.2615 13.852C11.3481 13.6873 11.4608 13.54 11.5995 13.41L13.5495 11.59V11.46H10.5595C10.3081 11.46 10.1045 11.382 9.94845 11.226C9.79245 11.07 9.71445 10.888 9.71445 10.68C9.71445 10.472 9.79245 10.29 9.94845 10.134C10.1045 9.978 10.3081 9.9 10.5595 9.9H15.1745C15.4085 9.9 15.6078 9.978 15.7725 10.134C15.9371 10.2813 16.0195 10.4633 16.0195 10.68C16.0195 11.0093 15.8895 11.291 15.6295 11.525L13.4845 13.54V13.67Z"
					fill="white"
				/>
				<path
					className={`${numbersRight.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M34.1573 57.1236C35.1501 57.6076 36.3524 57.1969 36.7862 56.181C38.9972 51.0036 40.0933 45.4102 39.9938 39.7663C39.8942 34.1224 38.6014 28.5712 36.2092 23.4749C35.7398 22.475 34.5239 22.1069 33.5487 22.6257L14.4719 32.7736C13.4967 33.2923 13.1412 34.5004 13.5199 35.5381C14.066 37.0346 14.3615 38.6159 14.3898 40.218C14.418 41.8201 14.1785 43.4108 13.6855 44.9257C13.3437 45.976 13.7415 47.1708 14.7344 47.6549L34.1573 57.1236Z"
					fill="#1E292E"
				/>
				<path
					d="M25.81 43.44C26.0613 43.44 26.265 43.518 26.421 43.674C26.577 43.83 26.655 44.012 26.655 44.22C26.655 44.428 26.577 44.61 26.421 44.766C26.265 44.922 26.0613 45 25.81 45H20.61C20.376 45 20.1767 44.9263 20.012 44.779C19.8473 44.623 19.765 44.4367 19.765 44.22C19.765 43.8127 19.96 43.466 20.35 43.18C21.3813 42.426 22.3303 41.6807 23.197 40.944C23.665 40.5453 24.055 40.1293 24.367 39.696C24.679 39.2627 24.835 38.8857 24.835 38.565C24.835 38.1663 24.692 37.8413 24.406 37.59C24.12 37.33 23.7213 37.2 23.21 37.2C22.846 37.2 22.534 37.265 22.274 37.395C22.014 37.525 21.7497 37.7417 21.481 38.045C21.299 38.2443 21.1517 38.383 21.039 38.461C20.9263 38.5303 20.805 38.565 20.675 38.565C20.4497 38.565 20.2633 38.4913 20.116 38.344C19.9687 38.1967 19.895 38.0103 19.895 37.785C19.895 37.4903 20.0163 37.1957 20.259 36.901C20.545 36.537 20.948 36.238 21.468 36.004C21.9967 35.7613 22.5773 35.64 23.21 35.64C23.886 35.64 24.4753 35.7657 24.978 36.017C25.4807 36.2683 25.862 36.615 26.122 37.057C26.3907 37.499 26.525 38.0017 26.525 38.565C26.525 39.4577 25.9357 40.45 24.757 41.542C24.1157 42.1487 23.34 42.7337 22.43 43.297V43.44H25.81ZM31.7311 39.41C32.3898 39.41 32.9704 39.54 33.4731 39.8C33.9758 40.06 34.3614 40.411 34.6301 40.853C34.9074 41.295 35.0461 41.789 35.0461 42.335C35.0461 42.881 34.9074 43.375 34.6301 43.817C34.3528 44.259 33.9498 44.61 33.4211 44.87C32.9011 45.13 32.2944 45.26 31.6011 45.26C30.9164 45.26 30.3054 45.117 29.7681 44.831C29.2394 44.5363 28.8278 44.1333 28.5331 43.622C28.2384 43.102 28.0911 42.5213 28.0911 41.88V39.02C28.0911 38.3787 28.2384 37.8023 28.5331 37.291C28.8278 36.771 29.2394 36.368 29.7681 36.082C30.3054 35.7873 30.9164 35.64 31.6011 35.64C32.1818 35.64 32.7104 35.7527 33.1871 35.978C33.6724 36.1947 34.0624 36.4633 34.3571 36.784C34.6431 37.1133 34.7861 37.4037 34.7861 37.655C34.7861 37.8803 34.7124 38.0667 34.5651 38.214C34.4178 38.3613 34.2314 38.435 34.0061 38.435C33.8588 38.435 33.7244 38.4003 33.6031 38.331C33.4904 38.2617 33.3561 38.136 33.2001 37.954C32.9661 37.6853 32.7234 37.4947 32.4721 37.382C32.2294 37.2607 31.9391 37.2 31.6011 37.2C31.0464 37.2 30.6044 37.3647 30.2751 37.694C29.9458 38.0233 29.7811 38.4653 29.7811 39.02V39.93C30.0151 39.774 30.2968 39.6483 30.6261 39.553C30.9641 39.4577 31.3324 39.41 31.7311 39.41ZM31.6011 43.7C32.1644 43.7 32.5978 43.5743 32.9011 43.323C33.2044 43.0717 33.3561 42.7423 33.3561 42.335C33.3561 41.9277 33.2044 41.5983 32.9011 41.347C32.5978 41.0957 32.1644 40.97 31.6011 40.97C31.0378 40.97 30.5914 41.1043 30.2621 41.373C29.9414 41.633 29.7811 41.9537 29.7811 42.335C29.7811 42.7163 29.9414 43.0413 30.2621 43.31C30.5914 43.57 31.0378 43.7 31.6011 43.7Z"
					fill="white"
				/>
				<path
					className={`${numbersRight.some(isNumberHovered) ? 'racetrack-number-hovered ' : 'racetrack-number'}`}
					d="M-7.99338e-05 78C-8.00304e-05 79.1046 0.895964 80.0052 1.99915 79.95C7.62191 79.6686 13.13 78.2029 18.1595 75.6403C23.1891 73.0776 27.6124 69.483 31.145 65.0994C31.8381 64.2394 31.6362 62.9851 30.7426 62.3358L13.2613 49.635C12.3677 48.9857 11.126 49.1956 10.3592 49.9907C9.25335 51.1374 7.96143 52.0959 6.53375 52.8234C5.10608 53.5508 3.57124 54.0326 1.99352 54.2533C0.899597 54.4063 -7.79482e-05 55.2874 -7.80448e-05 56.392L-7.99338e-05 78Z"
					fill="#38BB7F"
				/>
				<path
					d="M12.502 70.26C11.8 70.26 11.176 70.117 10.63 69.831C10.0927 69.5363 9.67236 69.1333 9.36903 68.622C9.07436 68.1107 8.92703 67.53 8.92703 66.88V64.02C8.92703 63.37 9.07436 62.7893 9.36903 62.278C9.67236 61.7667 10.0927 61.368 10.63 61.082C11.176 60.7873 11.8 60.64 12.502 60.64C13.204 60.64 13.8237 60.7873 14.361 61.082C14.907 61.368 15.3274 61.7667 15.622 62.278C15.9254 62.7893 16.077 63.37 16.077 64.02V66.88C16.077 67.53 15.9254 68.1107 15.622 68.622C15.3274 69.1333 14.907 69.5363 14.361 69.831C13.8237 70.117 13.204 70.26 12.502 70.26ZM12.502 68.7C13.0827 68.7 13.542 68.5353 13.88 68.206C14.218 67.8767 14.387 67.4347 14.387 66.88V64.02C14.387 63.4653 14.218 63.0233 13.88 62.694C13.542 62.3647 13.0827 62.2 12.502 62.2C11.9214 62.2 11.462 62.3647 11.124 62.694C10.786 63.0233 10.617 63.4653 10.617 64.02V66.88C10.617 67.4347 10.786 67.8767 11.124 68.206C11.462 68.5353 11.9214 68.7 12.502 68.7Z"
					fill="white"
				/>
			</svg>
		</div>
	);
};

export default Racetrack;
