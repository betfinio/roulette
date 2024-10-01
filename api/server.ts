import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 7777;

app.use(cors());
app.use(express.json());

// Configuration
const ROUND_DURATION = 60 * 1000; // 1 minute
const SPIN_DURATION = 10 * 1000; // 10 seconds
const BET_RATE = 5; // Adjust this number to control the rate of bets (higher means more bets)
const MAX_CHIP_VALUE = 100000; // 100k
const MIN_CHIP_VALUE = 1000; // 1k
const MAX_CHIPS_PER_NUMBER = 5; // Maximum 5 chips per number
const BANK_FEE_PERCENTAGE = 0.03; // 3% bank fee

// Helper functions
const generateRoundId = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

const getRandomInt = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getWheelNumbers = (): string[] => [
	'0',
	'32',
	'15',
	'19',
	'4',
	'21',
	'2',
	'25',
	'17',
	'34',
	'6',
	'27',
	'13',
	'36',
	'11',
	'30',
	'8',
	'23',
	'10',
	'5',
	'24',
	'16',
	'33',
	'1',
	'20',
	'14',
	'31',
	'9',
	'22',
	'18',
	'29',
	'7',
	'28',
	'12',
	'35',
	'3',
	'26',
];

// Generate random nickname
const generateRandomNickname = (): string => {
	const adjectives = ['Swift', 'Silent', 'Flying', 'Dark', 'Mighty', 'Lucky', 'Crazy', 'Brave', 'Happy', 'Wild'];
	const animals = ['Fox', 'Wolf', 'Eagle', 'Lion', 'Tiger', 'Bear', 'Shark', 'Dragon', 'Phoenix', 'Panther'];
	return `${adjectives[getRandomInt(0, adjectives.length - 1)]}${animals[getRandomInt(0, animals.length - 1)]}${getRandomInt(10, 99)}`;
};

// Define bet types and payouts according to the table provided
const betTypes = [
	{ type: 'straight', payout: 36 }, // Single number
	{ type: 'split', payout: 18 }, // Two numbers
	{ type: 'corner', payout: 9 }, // Four numbers
	{ type: 'row', payout: 12 }, // Three numbers (Row)
	{ type: 'top_line', payout: 9 }, // First five numbers (0,1,2,3,4)
	{ type: 'hi_lo_zero', payout: 12 }, // High/Low with zero
	{ type: 'dozen', payout: 3 }, // 12 numbers
	{ type: 'column', payout: 3 }, // 12 numbers
	{ type: 'red_black', payout: 2 }, // 18 numbers
	{ type: 'even_odd', payout: 2 }, // 18 numbers
	{ type: 'high_low', payout: 2 }, // 18 numbers
];

const redNumbers = new Set(['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36']);
const blackNumbers = new Set(['2', '4', '6', '8', '10', '11', '13', '15', '17', '20', '22', '24', '26', '28', '29', '31', '33', '35']);

// Bank account to collect the 3% fee
let bankAccount = 0;

// Interfaces
interface Round {
	id: string;
	startTime: string;
	endTime: string;
	status: 'waiting' | 'completed';
	players: number;
	betSum: number;
	winningNumber?: string;
	winningAmount?: number;
	winners?: Winner[];
}

interface Bet {
	id: string;
	roundId: string;
	nickname: string;
	address: string;
	chips: number; // Number of chips
	chipValue: number; // Value per chip
	totalAmount: number; // chips * chipValue
	betType: string;
	numbers: string[];
	payout: number;
	timestamp: string;
	amountWon?: number;
}

interface Winner {
	nickname: string;
	amountWon: number;
}

const roundsFilePath = path.join(__dirname, 'rounds.json');
const betsFilePath = path.join(__dirname, 'bets.json');

// Initialize the rounds and bets arrays
let rounds: Round[] = [];
let bets: Bet[] = [];

// Load rounds from file
const loadRoundsFromFile = (): void => {
	try {
		if (fs.existsSync(roundsFilePath)) {
			const data = fs.readFileSync(roundsFilePath, 'utf-8');
			rounds = JSON.parse(data) as Round[];
			console.log('📁 Round data loaded successfully.');
		} else {
			console.log('⚠️ No round file found. Starting a new one.');
			rounds = [];
		}
	} catch (err) {
		console.error('❌ Error loading round data:', err);
	}
};

// Save rounds to file
const saveRoundsToFile = (): void => {
	try {
		fs.writeFileSync(roundsFilePath, JSON.stringify(rounds, null, 2));
		// console.log('✅ Round data updated.');
	} catch (err) {
		console.error('❌ Error saving round data:', err);
	}
};

// Load bets from file
const loadBetsFromFile = (): void => {
	try {
		if (fs.existsSync(betsFilePath)) {
			const data = fs.readFileSync(betsFilePath, 'utf-8');
			bets = JSON.parse(data) as Bet[];
			console.log('📁 Bet data loaded successfully.');
		} else {
			console.log('⚠️ No bet file found. Starting a new one.');
			bets = [];
		}
	} catch (err) {
		console.error('❌ Error loading bet data:', err);
	}
};

// Save bets to file
const saveBetsToFile = (): void => {
	try {
		fs.writeFileSync(betsFilePath, JSON.stringify(bets, null, 2));
		// console.log('✅ Bet data updated.');
	} catch (err) {
		console.error('❌ Error saving bet data:', err);
	}
};

// Event emitter for notifying new bets
const betEventEmitter = new EventEmitter();

// Generate a new round
const generateNewRound = (delay = 0): Round => {
	const now = new Date();
	const startTime = new Date(now.getTime() + delay).toISOString();
	const endTime = new Date(now.getTime() + delay + ROUND_DURATION).toISOString();

	const newRound: Round = {
		id: generateRoundId(),
		startTime,
		endTime,
		status: 'waiting',
		players: 0, // Will be updated as bets are made
		betSum: 0, // Will be updated as bets are made
	};

	console.log(`🕰️ New round created: ID ${newRound.id}, start: ${newRound.startTime}, end: ${newRound.endTime}.`);

	return newRound;
};

// Initialize rounds and bets
const initializeData = (): void => {
	loadRoundsFromFile();
	loadBetsFromFile();

	// Remove any 'waiting' round from the previous session
	const waitingRounds = rounds.filter((round) => round.status === 'waiting');
	if (waitingRounds.length > 0) {
		console.log(`🗑️ Removing ${waitingRounds.length} waiting round(s) from the previous session.`);
		rounds = rounds.filter((round) => round.status !== 'waiting');
	}

	// Add a new 'waiting' round
	const newRound = generateNewRound();
	rounds.push(newRound);

	console.log(`🚀 Server started. Round #${newRound.id} is in progress.`);
	saveRoundsToFile();
};

// Function to wait for a few milliseconds
const wait = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// Simulate bets for the current round
const simulateBets = async (round: Round): Promise<void> => {
	const roundEndTime = new Date(round.endTime).getTime();

	const simulateBet = () => {
		const betTypeObj = betTypes[getRandomInt(0, betTypes.length - 1)];
		const betType = betTypeObj.type;
		const payout = betTypeObj.payout;
		let numbers: string[] = [];

		switch (betType) {
			case 'straight':
				numbers = [getWheelNumbers()[getRandomInt(0, 36)]];
				break;
			case 'split':
				// Simplified: pick two random numbers
				numbers = [getWheelNumbers()[getRandomInt(0, 36)], getWheelNumbers()[getRandomInt(0, 36)]];
				break;
			case 'corner':
				// Simplified: pick four random numbers
				numbers = [];
				while (numbers.length < 4) {
					const num = getWheelNumbers()[getRandomInt(0, 36)];
					if (!numbers.includes(num)) {
						numbers.push(num);
					}
				}
				break;
			case 'row':
				// Simplified: pick three random numbers (simulate a row)
				numbers = [];
				while (numbers.length < 3) {
					const num = getWheelNumbers()[getRandomInt(1, 36)]; // Exclude zero
					if (!numbers.includes(num)) {
						numbers.push(num);
					}
				}
				break;
			case 'top_line':
				numbers = ['0', '1', '2', '3', '4'];
				break;
			case 'hi_lo_zero': {
				// High/Low with zero
				const hiLoZero = getRandomInt(0, 1) === 0 ? 'low_zero' : 'high_zero';
				numbers =
					hiLoZero === 'low_zero'
						? ['0', ...getWheelNumbers().filter((n) => Number.parseInt(n) >= 1 && Number.parseInt(n) <= 18)]
						: ['0', ...getWheelNumbers().filter((n) => Number.parseInt(n) >= 19)];
				break;
			}
			case 'dozen':
				{
					const dozen = getRandomInt(1, 3);
					numbers = getWheelNumbers().filter((n) => n !== '0' && Math.ceil(Number.parseInt(n) / 12) === dozen);
				}
				break;
			case 'column':
				{
					const column = getRandomInt(1, 3);
					numbers = getWheelNumbers().filter((n) => n !== '0' && (Number.parseInt(n) - column) % 3 === 0);
				}
				break;
			case 'red_black':
				{
					const color = getRandomInt(0, 1) === 0 ? 'red' : 'black';
					numbers = color === 'red' ? Array.from(redNumbers) : Array.from(blackNumbers);
				}
				break;
			case 'even_odd':
				{
					const evenOdd = getRandomInt(0, 1) === 0 ? 'even' : 'odd';
					numbers = getWheelNumbers().filter((n) => n !== '0' && (Number.parseInt(n) % 2 === 0) === (evenOdd === 'even'));
				}
				break;
			case 'high_low':
				{
					const highLow = getRandomInt(0, 1) === 0 ? 'low' : 'high';
					numbers = getWheelNumbers().filter((n) => n !== '0' && (highLow === 'low' ? Number.parseInt(n) <= 18 : Number.parseInt(n) >= 19));
				}
				break;
			default:
				numbers = [getWheelNumbers()[getRandomInt(0, 36)]];
				break;
		}

		const chips = getRandomInt(1, MAX_CHIPS_PER_NUMBER);
		const chipValue = getRandomInt(MIN_CHIP_VALUE / 1000, MAX_CHIP_VALUE / 1000) * 1000; // Multiples of 1k
		const totalAmount = chips * chipValue;

		// Calculate bank fee
		const bankFee = totalAmount * BANK_FEE_PERCENTAGE;
		bankAccount += bankFee;

		const bet: Bet = {
			id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			roundId: round.id,
			nickname: generateRandomNickname(),
			address: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
			chips,
			chipValue,
			totalAmount,
			betType,
			numbers,
			payout,
			timestamp: new Date().toISOString(),
		};

		bets.push(bet);
		saveBetsToFile();

		// Update round stats
		round.players += 1;
		round.betSum += totalAmount;

		// Notify listeners about the new bet
		betEventEmitter.emit('newBet', bet);

		// For demonstration, log the bet
		console.log(
			`💰 New bet placed by ${bet.nickname} on ${bet.betType} (${bet.numbers.join(', ')}) with ${bet.chips} chip(s) of ${bet.chipValue} each (Total: ${
				bet.totalAmount
			}) in round ${bet.roundId}.`,
		);
	};

	const scheduleNextBet = () => {
		const now = Date.now();
		if (now >= roundEndTime || round.status !== 'waiting') {
			return;
		}
		simulateBet();
		const betInterval = Math.max(500, ROUND_DURATION / (BET_RATE * getRandomInt(1, 3)));
		setTimeout(scheduleNextBet, betInterval);
	};

	scheduleNextBet();
};

// Calculate winnings for completed round
const calculateWinnings = (round: Round): void => {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const winningNumber = round.winningNumber!;
	const roundBets = bets.filter((bet) => bet.roundId === round.id);
	const winnersMap: { [key: string]: number } = {};

	// biome-ignore lint/complexity/noForEach: <explanation>
	roundBets.forEach((bet) => {
		if (bet.numbers.includes(winningNumber)) {
			const amountWon = bet.totalAmount * (bet.payout - 1); // Net winnings
			bet.amountWon = amountWon;
			if (winnersMap[bet.nickname]) {
				winnersMap[bet.nickname] += amountWon;
			} else {
				winnersMap[bet.nickname] = amountWon;
			}
		} else {
			bet.amountWon = 0;
		}
	});

	const winners: Winner[] = Object.entries(winnersMap).map(([nickname, amountWon]) => ({
		nickname,
		amountWon,
	}));

	round.winningAmount = winners.reduce((sum, winner) => sum + winner.amountWon, 0);
	round.winners = winners;

	saveRoundsToFile();
	saveBetsToFile();
};

// Update rounds periodically
const updateRounds = async (): Promise<void> => {
	const now = Date.now();
	let roundsChanged = false;

	for (const round of rounds) {
		if (round.status === 'waiting') {
			const endTime = new Date(round.endTime).getTime();
			if (now >= endTime) {
				// Round finished, update status to 'completed' and generate winning number
				round.status = 'completed';
				round.winningNumber = getWheelNumbers()[getRandomInt(0, 36)];

				console.log(`🎯 Round #${round.id} completed! Winning number: ${round.winningNumber}.`);

				// Calculate winnings
				calculateWinnings(round);

				roundsChanged = true;
			}
		}
	}

	if (roundsChanged) {
		saveRoundsToFile();

		console.log(`⏳ Waiting ${SPIN_DURATION / 1000} seconds to start a new round...`);
		await wait(SPIN_DURATION);

		// Generate a new round after the wait time
		const newRound = generateNewRound();
		rounds.push(newRound);

		console.log(`🆕 New round #${newRound.id} started!`);
		saveRoundsToFile();

		// Start simulating bets for the new round
		simulateBets(newRound);
	}

	// Remove rounds older than 1 hour
	rounds = rounds.filter((round) => {
		const endTime = new Date(round.endTime).getTime();
		return now - endTime <= 60 * 60 * 1000; // Keep rounds from the last hour
	});
};

// Start updating rounds every second
setInterval(updateRounds, 1000);

// Initialize data
initializeData();

// Start simulating bets for the current round
const currentRound = rounds.find((round) => round.status === 'waiting');
if (currentRound) {
	simulateBets(currentRound);
}

// API endpoints

// Endpoint to get the current round
app.get('/api/currentRound', (req, res) => {
	const now = Date.now();
	// Find the active or next round to start
	const activeRound = rounds
		.filter((round) => round.status === 'waiting' && new Date(round.endTime).getTime() > now)
		.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

	res.json(activeRound || null);
});

// Endpoint to fetch round by ID
app.get('/api/round/:id', (req, res) => {
	const roundId = req.params.id;
	const round = rounds.find((round) => round.id === roundId);

	if (round) {
		res.json(round);
	} else {
		res.status(404).json({ error: 'Round not found' });
	}
});

// Endpoint to fetch the last 'n' results
app.get('/api/results', (req, res) => {
	const limit = Number.parseInt(req.query.limit as string) || 6; // Get the limit of results, or 6 by default

	// Filter completed rounds and sort by endTime (most recent first)
	const completedRounds = rounds
		.filter((round) => round.status === 'completed')
		.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
		.slice(0, limit);

	// Always return an array, even if it's empty
	res.json(completedRounds);
});

// Endpoint to list all rounds
app.get('/api/rounds', (req, res) => {
	res.json(rounds);
});

// Endpoint to get bets for a specific round
app.get('/api/bets/:roundId', (req, res) => {
	const roundId = req.params.roundId;
	const roundBets = bets.filter((bet) => bet.roundId === roundId);

	res.json(roundBets);
});

// Endpoint to get recent bets
app.get('/api/bets', (req, res) => {
	const limit = Number.parseInt(req.query.limit as string) || 20; // Get the limit of bets, or 20 by default

	const recentBets = bets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);

	res.json(recentBets);
});

// Endpoint to get the list of winners for a specific round
app.get('/api/winners/:roundId', (req, res) => {
	const roundId = req.params.roundId;
	const round = rounds.find((round) => round.id === roundId);

	if (round?.winners) {
		res.json(round.winners);
	} else {
		res.status(404).json({ error: 'Winners not found for this round.' });
	}
});

// Endpoint for Server-Sent Events to notify frontend of new bets
app.get('/api/betUpdates', (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.flushHeaders(); // flush the headers to establish SSE with client

	const onNewBet = (bet: Bet) => {
		res.write(`data: ${JSON.stringify(bet)}\n\n`);
	};

	betEventEmitter.on('newBet', onNewBet);

	req.on('close', () => {
		betEventEmitter.removeListener('newBet', onNewBet);
	});
});

// Endpoint to get bank account balance
app.get('/api/bank', (req, res) => {
	res.json({ bankAccount });
});

// Start the server
app.listen(PORT, () => {
	console.log(`🌍 Server running on port ${PORT}`);
});
