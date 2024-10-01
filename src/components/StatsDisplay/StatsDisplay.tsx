import axios from 'axios';
import type React from 'react';
import { useQuery } from 'react-query';

// Função para buscar os últimos 50 resultados da API
const fetchLast50Results = async () => {
	const { data } = await axios.get('http://localhost:7777/api/results?limit=50');
	console.log(data);
	return data;
};

// Função para calcular as estatísticas de Hot/Cold, Red/Black e Odd/Even
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const calculateStats = (results: any[]) => {
	const numberCount: Record<string, number> = {};
	let redCount = 0;
	let blackCount = 0;
	let oddCount = 0;
	let evenCount = 0;

	// Definir números vermelhos e pretos
	const redNumbers = ['32', '19', '21', '25', '34', '27', '36', '30', '23', '5', '16', '1', '14', '9', '18', '7', '12', '3'];
	const blackNumbers = ['15', '4', '2', '17', '6', '13', '11', '8', '10', '24', '33', '20', '31', '22', '29', '28', '35', '26'];

	// Contar a ocorrência de cada número e calcular as porcentagens
	// biome-ignore lint/complexity/noForEach: <explanation>
	results.forEach((round) => {
		const winningNumber = round.winningNumber;

		// Contar a ocorrência de cada número
		numberCount[winningNumber] = (numberCount[winningNumber] || 0) + 1;

		// Contar números vermelhos e pretos
		if (redNumbers.includes(winningNumber)) {
			redCount++;
		} else if (blackNumbers.includes(winningNumber)) {
			blackCount++;
		}

		// Contar números ímpares e pares
		const num = Number.parseInt(winningNumber, 10);
		if (num % 2 === 0) {
			evenCount++;
		} else {
			oddCount++;
		}
	});

	// Ordenar os números por frequência para determinar Hot e Cold
	const sortedNumbers = Object.entries(numberCount).sort((a, b) => b[1] - a[1]);
	const hotNumbers = sortedNumbers.slice(0, 3).map(([num]) => num); // 3 números mais frequentes
	const coldNumbers = sortedNumbers.slice(-3).map(([num]) => num); // 3 números menos frequentes

	const totalRounds = results.length;

	return {
		hot: hotNumbers,
		cold: coldNumbers,
		redBlack: {
			red: ((redCount / totalRounds) * 100).toFixed(0),
			black: ((blackCount / totalRounds) * 100).toFixed(0),
		},
		oddEven: {
			odd: ((oddCount / totalRounds) * 100).toFixed(0),
			even: ((evenCount / totalRounds) * 100).toFixed(0),
		},
	};
};

const StatsDisplay: React.FC = () => {
	// Usando React Query para buscar os dados dos últimos 50 resultados
	const {
		data: results,
		isLoading,
		error,
	} = useQuery('stats', fetchLast50Results, {
		refetchInterval: 60000, // Atualiza a cada 1 minuto
	});

	// Mostrar o estado de carregamento
	if (isLoading) {
		return (
			<div className="bg-gray-700 rounded-lg mt-4 p-2 border w-[146px] h-[266px] flex flex-col items-center justify-center border-[var(--border-primary)] animate-pulse">
				<div className="w-full h-full bg-gray-700 rounded-lg" />
			</div>
		);
	}

	// Mostrar erros
	if (error) {
		return (
			<div className="bg-gray-700 rounded-lg mt-4 p-2 border w-[146px] h-[266px] flex flex-col items-center justify-center border-[var(--border-primary)]">
				<div className="text-white text-sm">Error fetching stats. Please try again.</div>
			</div>
		);
	}

	// Calcular estatísticas com base nos resultados
	const stats = calculateStats(results);

	const { hot, cold, redBlack, oddEven } = stats;

	return (
		<div className="bg-[#131624] mt-4 p-2 rounded-lg border w-[146px] h-[266px] flex flex-col items-center justify-center border-[var(--border-primary)] tabular-nums">
			{/* Hot/Cold Section */}
			<div className="text-center mb-2">
				<h3 className="text-white text-sm font-medium">Hot/Cold</h3>
				<div className="flex justify-center items-center rounded-md p-1 gap-4">
					{/* Bloco Hot */}
					<div className="flex flex-col items-center bg-[var(--red)] rounded-md w-10 text-white text-xs py-1">
						{hot.map((num: string, index: number) => (
							<div className="py-1" key={index}>
								{num}
							</div>
						))}
					</div>
					{/* Bloco Cold */}
					<div className="flex flex-col items-center bg-[var(--blue)] rounded-md w-10 text-white text-xs py-1">
						{cold.map((num: string, index: number) => (
							<div className="py-1" key={index}>
								{num}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Red/Black Section */}
			<div className="mb-2">
				<h3 className="text-white text-sm text-center">Red/Black</h3>
				<div className="flex justify-center items-center gap-4">
					{/* Bloco Red */}
					<div className="flex flex-col items-center w-10 bg-[var(--red)] rounded-md py-2 text-white text-xs border border-[var(--border-primary)]">
						{redBlack.red}%
					</div>
					{/* Bloco Black sem fundo */}
					<div className="flex flex-col items-center w-10 py-2 text-white text-xs border border-[#9999AD] rounded-md">{redBlack.black}%</div>
				</div>
			</div>

			{/* Odd/Even Section */}
			<div className="">
				<h3 className="text-white text-sm text-center">Odd/Even</h3>
				<div className="flex justify-center items-center border border-[#9999AD] rounded-md p-1 w-24 h-10 mx-auto">
					{/* Item com Odd/Even lado a lado */}
					<div className="flex items-center justify-between w-full text-white text-xs">
						<div className="w-1/2 text-center">{oddEven.odd}%</div>
						<div className="w-1/2 text-center">{oddEven.even}%</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatsDisplay;
