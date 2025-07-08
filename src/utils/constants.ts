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
