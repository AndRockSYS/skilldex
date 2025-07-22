export const PLATFORM_COMMISSION = 1;

export const LOCAL_KEY_MODAL = 'skilldex_Modal_Value';
export const LOCAL_KEY_ANNOUNCEMENT_TIMESTAMP = 'skilldex_Last_Announcement';

export const MIN_STAKE = 0.1;
export const MAX_STAKE = 10;

export const TURN_LIMITS = [
    { id: 5 * 60 * 1000, name: '5 Minutes (Blitz)' },
    { id: 60 * 60 * 1000, name: '1 Hour' },
    { id: 24 * 60 * 60 * 1000, name: '24 Hours' },
];

export const EXPIRATION_OPTIONS = [
    { id: 0, name: 'Never' },
    { id: 60 * 60 * 1000, name: '1 Hour' },
    { id: 4 * 60 * 60 * 1000, name: '4 Hours' },
    { id: 12 * 60 * 1000, name: '12 Hours' },
    { id: 24 * 60 * 60 * 1000, name: '24 Hours' },
];
export const QUEUE_TIME_LIMIT = 2 * 60 * 1000;

export const STATS_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const REWARD_POINTS = {
    created: 3,
    played: 5,
    won: 10,
};

export const PROGRAM_ADDRESS = 'FUQShdGHbGptGbQikvaEDvEEEGqChtDa1EuHQUBqQ6vQ';

export const PDA_AFFIXES = {
    lobby: 'lobby',
    platform: 'platform',
    suffix: 'skilldex3gf634bf',
};

export const GAME_SETTINGS = {
    connectFour: {
        initialBoard: () => {
            return Array(GAME_SETTINGS.connectFour.rows)
                .fill('none')
                .map(() => Array(GAME_SETTINGS.connectFour.columns).fill('none'));
        },
        columns: 7,
        rows: 6,
    },
    checkers: {
        initialBoard: () => {
            const initialBoard = Array(8)
                .fill(null)
                .map(() => Array(8).fill('none'));

            for (let row = 0; row < 3; row++) {
                for (let col = row % 2 === 0 ? 1 : 0; col < 8; col += 2) {
                    initialBoard[row][col] = 'opponent';
                }
            }
            for (let row = 5; row < 8; row++) {
                for (let col = row % 2 === 0 ? 1 : 0; col < 8; col += 2) {
                    initialBoard[row][col] = 'creator';
                }
            }

            return initialBoard;
        },
    },
    ticTacToe: {
        initialBoard: () =>
            Array(3)
                .fill('none')
                .map(() => Array(3).fill('none')),
    },
    reversi: {
        initialBoard: () =>
            Array(8)
                .fill(null)
                .map(() => Array(8).fill('none')),
    },
};
