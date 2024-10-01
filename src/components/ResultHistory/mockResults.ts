// Mock dos resultados com timestamp
export const mockResults = [
	{ value: 30, color: 'red', timestamp: 1696200000000 },
	{ value: 18, color: 'black', timestamp: 1696201000000 },
	{ value: 21, color: 'red', timestamp: 1696202000000 },
	{ value: 33, color: 'black', timestamp: 1696203000000 },
	{ value: 30, color: 'black', timestamp: 1696205000000 },
	{ value: 1, color: 'red', timestamp: 1696206000000 },
	{ value: 7, color: 'red', timestamp: 1696207000000 },
	{ value: 45, color: 'black', timestamp: 1696208000000 },
	{ value: 0, color: 'green', timestamp: 1696210000000 },
	{ value: 36, color: 'black', timestamp: 1696211000000 },
	{ value: 23, color: 'red', timestamp: 1696212000000 },
];

// Função que simula uma requisição para obter os resultados
export const fetchResults = async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockResults);
		}, 500); // Simulando um delay de 500ms
	});
};
