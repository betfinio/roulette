// mockStats.js

// Mock dos dados de estatísticas
export const mockStats = {
	hot: [23, 18, 28],
	cold: [23, 18, 28],
	redBlack: { red: 36, black: 64 },
	oddEven: { odd: 52, even: 46 },
};

// Função que simula uma requisição para obter os dados de estatísticas
export const fetchStats = async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockStats);
		}, 500); // Simulando um delay de 500ms para a resposta
	});
};
