import { motion } from 'framer-motion';
import { useState } from 'react';
import externalLinkImg from '../../assets/BetHistory/external-link.svg';
import foxIcon from '../../assets/BetHistory/fox.svg';
import bronze_trophy from '../../assets/BetHistory/trophy-bronze.svg';
import gold_trophy from '../../assets/BetHistory/trophy-gold.svg';
import silver_trophy from '../../assets/BetHistory/trophy-silver.svg';
import chipBetfinIcon from '../../assets/images/chip-betfin.svg';
import mockBetHistory from '../../mocks/mockBetHistory.json';
import { BetInfo } from '../BetInfo/BetInfo';

// Ícones de troféus e moedas
const icons: { [key: string]: string } = {
	gold_trophy,
	silver_trophy,
	bronze_trophy,
	chipBetfinIcon,
};

// Tipos de dados
type PlayerData = {
	id: string;
	nickname: string;
	address: string;
	bets: string;
	amount: string;
	trophy?: string;
};

type BonusData = {
	id: string;
	nickname: string;
	address: string;
	amount: string;
	bonus: string;
	trophy?: string;
};

type BetData = {
	id: string;
	nickname: string;
	address: string;
	amount: string;
	bet: string;
	trophy?: string;
};

// O componente BetHistory mantém abas e estrutura de exibição
const BetHistory = () => {
	const [activeTab, setActiveTab] = useState<'players' | 'bets'>('bets');

	// Define os dados com base na aba ativa
	const data = mockBetHistory[activeTab] as Array<PlayerData | BonusData | BetData>;

	const isPlayerData = (item: PlayerData | BonusData | BetData): item is PlayerData => {
		return 'bets' in item;
	};

	const isBonusData = (item: PlayerData | BonusData | BetData): item is BonusData => {
		return 'bonus' in item;
	};

	const isBetData = (item: PlayerData | BonusData | BetData): item is BetData => {
		return 'bet' in item;
	};

	return (
		<div className="w-full overflow-hidden rounded-lg mt-3">
			{/* Abas */}
			<div className="flex justify-center space-x-4 mb-4 w-full">
				{['Players', 'Bets'].map((tab) => (
					<button
						type="button"
						key={tab}
						className={`px-4 py-2 rounded-lg font-semibold text-xs border-[1px] border-[var(--border-primary)] w-full ${
							activeTab === tab.toLowerCase() ? 'bg-[var(--yellow)] text-black' : 'bg-(var(--black)) text-white'
						}`}
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						onClick={() => setActiveTab(tab.toLowerCase() as any)}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Lista de apostas */}
			<div className="relative w-full h-[360px] bg-[var(--bg-sec)] border-[var(--border-primary)] border-[1px] box-border rounded-lg p-4">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth rounded-lg"
					style={{
						paddingRight: '8px',
						scrollbarWidth: 'thin',
						scrollbarColor: 'var(--bg-primary) var(--bg-sec)',
					}}
				>
					{data.map((item, index) => (
						<motion.div
							key={item.id}
							className={`flex items-center justify-between p-4 mb-2 rounded-xl border-2 ${
								index % 2 === 0 ? 'bg-[var(--bg-lighter)] border-[var(--border-primary)]' : 'bg-[var(--bg-sec)]'
							} ${
								item.trophy === 'gold_trophy'
									? 'border-[var(--gold)]'
									: item.trophy === 'silver_trophy'
										? 'border-[var(--silver)]'
										: item.trophy === 'bronze_trophy'
											? 'border-[var(--bronze)]'
											: 'border-transparent'
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2, delay: index * 0.1 }}
							style={{ width: '100%', height: '78px' }}
						>
							<div className="flex items-center space-x-4">
								<img src={foxIcon} alt="fox" className="h-[24px]" />
								<div className="flex flex-col w-fit pr-1">
									<span className="text-white text-xs font-bold flex items-center">
										{item.nickname.replace(/(.{5}).*(.{4})/, '$1..$2')}
										{item.trophy && <img src={icons[item.trophy]} alt="trophy" className="h-[16px] ml-2" />}
									</span>
									{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
									<a href="#" className="block text-[var(--text-gray)] text-xs">
										{item.address}
									</a>
								</div>
							</div>

							<div className="text-right">
								{isPlayerData(item) && (
									<div className="w-22">
										<div className="flex w-full items-center justify-end space-x-1 text-white font-semibold">
											<span className="text-xs opacity-100">{item.bets}</span>
											<span className="text-xs opacity-100">bets</span>
											<img src={externalLinkImg} alt="link" className="h-4 w-4" />
										</div>
										<div className="flex items-center">
											<span className="text-white text-xs font-semibold block whitespace-nowrap tabular-nums">{item.amount}</span>
											<img src={chipBetfinIcon} alt="icon" className="h-4 ml-1 inline-block" />
										</div>
									</div>
								)}
								{isBonusData(item) && (
									<div className="flex flex-col space-y-2 text-right">
										<div className="flex items-center justify-end">
											<span className="text-blue-500 text-xs font-semibold">{item.amount}</span>
											<img src={chipBetfinIcon} alt="icon" className="h-3 ml-1 inline-block" />
										</div>
										<div className="flex items-center justify-end">
											<span className="text-yellow-500 text-xs font-semibold">{item.bonus}</span>
											<img src={chipBetfinIcon} alt="icon" className="h-3 ml-1 inline-block" />
										</div>
									</div>
								)}
								{isBetData(item) && (
									<div className="w-22">
										<div className="flex items-center justify-end space-x-1 text-yellow-500 font-semibold">
											<span className="text-xs opacity-100">{item.amount}</span>
											<img src={chipBetfinIcon} alt="icon" className="h-4 w-4 ml-1" />
										</div>
										<div className="flex items-center justify-end">
											<span className="text-white text-xs font-bold block whitespace-nowrap tabular-nums">{item.bet} BET</span>
										</div>
									</div>
								)}
							</div>
						</motion.div>
					))}
				</motion.div>
				{/* Gradiente de sobreposição */}
				<div
					className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
					style={{
						background: 'linear-gradient(to bottom, transparent, transparent, hsl(229, 31%, 11%))',
					}}
				/>
			</div>
			<BetInfo />
		</div>
	);
};

export default BetHistory;
