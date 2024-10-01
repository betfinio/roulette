import axios from 'axios';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useQuery } from 'react-query';

// Função para pegar os últimos 6 resultados ordenados por timestamp
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getLast7Results = (results: any) => {
	return results
		.sort((a: { endTime: string }, b: { endTime: string }) => {
			return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
		})
		.slice(0, 6);
};

// Função para definir a cor de fundo com base no número vencedor
const getColorClassByWinningNumber = (winningNumber: string) => {
	const redNumbers = ['32', '19', '21', '25', '34', '27', '36', '30', '23', '5', '16', '1', '14', '9', '18', '7', '12', '3'];
	const blackNumbers = ['15', '4', '2', '17', '6', '13', '11', '8', '10', '24', '33', '20', '31', '22', '29', '28', '35', '26'];

	if (winningNumber === '0') {
		return 'green';
	}
	if (redNumbers.includes(winningNumber)) {
		return 'red';
	}
	if (blackNumbers.includes(winningNumber)) {
		return 'black';
	}

	return '';
};

// Função que busca os resultados reais da API
const fetchRealResults = async () => {
	const { data } = await axios.get('http://localhost:7777/api/results?limit=7');
	return data;
};

const ResultHistory: React.FC = () => {
	// Usando o react-query para buscar os dados da API, refazendo a cada 10 segundos (10000 ms)
	const {
		data: results,
		isLoading,
		error,
	} = useQuery('results', fetchRealResults, {
		refetchInterval: 10000, // Atualiza a cada 10 segundos
		retry: true, // Tenta refazer a requisição automaticamente em caso de erro
		retryDelay: 5000, // Reexecuta a cada 5 segundos em caso de erro
	});

	// Mostrar o estado de carregamento
	if (isLoading) {
		return (
			<div className="bg-gray-700 rounded-lg mt-4 p-2 border w-[146px] h-[266px] flex flex-col items-center justify-center border-[var(--border-primary)] animate-pulse">
				<div className="w-full h-full bg-gray-700 rounded-lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="bg-[#131624] mt-4 p-2 rounded-lg border max-w-[146px] max-h-[266px] flex justify-center items-center text-white text-sm"
				style={{ borderColor: '#151A2A' }}
			>
				Error: Trying again...
			</div>
		);
	}

	// Pega os últimos 7 resultados
	const lastResults = getLast7Results(results || []);

	// Se a API retornar "Nenhum resultado encontrado", exibe a mensagem adequada
	if (lastResults.length === 0) {
		return (
			<div
				className="bg-[#131624] mt-4 p-2 rounded-lg border max-w-[146px] max-h-[266px] flex justify-center items-center text-white text-sm"
				style={{ borderColor: '#151A2A' }}
			>
				No results, waiting new round...
			</div>
		);
	}

	// Função para gerar uma linha com os resultados
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const createRow = (result: any, index: number) => {
		const winningNumber = result?.winningNumber || '';
		const colorClass = getColorClassByWinningNumber(winningNumber);

		return (
			<motion.div
				key={index}
				className="grid grid-cols-3 gap-x-2 w-32 place-items-center tabular-nums"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
			>
				{/* Coluna Vermelha */}
				{colorClass === 'red' ? (
					<div className={clsx('w-8 h-8 flex items-center justify-center rounded-md text-white text-xs bg-[var(--red)]')}>{winningNumber}</div>
				) : (
					<div className="w-8 h-8" />
				)}

				{/* Coluna Verde */}
				{colorClass === 'green' ? (
					<div className={clsx('w-8 h-8 flex items-center justify-center rounded-md text-white text-xs bg-[var(--green)]')}>{winningNumber}</div>
				) : (
					<div className="w-8 h-8" />
				)}

				{/* Coluna Preta */}
				{colorClass === 'black' ? (
					<div className={clsx('w-8 h-8 flex items-center justify-center rounded-md text-white text-xs bg-[var(--black)]')}>{winningNumber}</div>
				) : (
					<div className="w-8 h-8" />
				)}
			</motion.div>
		);
	};

	return (
		<div
			className="bg-[#131624] mt-4 p-2 rounded-lg border max-w-[166px] max-h-[266px] overflow-hidden flex flex-col justify-start pt-4"
			style={{ borderColor: '#151A2A' }}
		>
			<AnimatePresence initial={false}>
				{/* Renderizando e animando a lista */}
				<motion.div className="flex flex-col space-y-2">
					{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
					{lastResults.map((result: any, index: number) => (
						<motion.div
							key={result.endTime}
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.6 }}
						>
							{createRow(result, index)}
						</motion.div>
					))}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default ResultHistory;
