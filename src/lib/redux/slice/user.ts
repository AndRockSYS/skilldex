import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import AppDatabase from '@/lib/firebase/client';

import { UserStats } from '@/types/user';
import { Timestamp } from '@/types/utils';
import { REWARD_POINTS } from '@/utils/constants';

const initialState: UserStats = {
    walletAddress: '',
    points: 0,
    games: {
        created: 0,
        played: 0,
        won: 0,
    },
    notifications: {
        gameSound: true,
        browser: true,
    },
    lastActivity: Date.now(),
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state = action.payload;
        });
        builder.addCase(addGame.fulfilled, (state, action) => {
            state = action.payload;
        });
        builder.addCase(updateUserField.fulfilled, (state, action) => {
            state = action.payload;
        });
        builder.addCase(updateLastActivity.fulfilled, (state, action) => {
            state.lastActivity = action.payload;
        });
        builder.addCase(updateNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
        });
    },
});

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (wallet: string) => await AppDatabase.fetchUser(wallet)
);

export const addGame = createAsyncThunk(
    'user/addGame',
    async ({ gameType }: { gameType: 'created' | 'played' | 'won' }, { getState }) => {
        let user = getState() as UserStats;

        user.games[gameType]++;
        user.points += REWARD_POINTS[gameType];
        await AppDatabase.updateUser(user);

        return user;
    }
);

export const updateUserField = createAsyncThunk(
    'user/updateUserField',
    async ({ name, value }: { name: 'name' | 'avatar'; value: string }, { getState }) => {
        let user = getState() as UserStats;

        user[name] = value;
        await AppDatabase.updateUser(user);

        return user;
    }
);

export const updateLastActivity = createAsyncThunk(
    'user/updateLastActivity',
    async ({ timestamp }: { timestamp: Timestamp }, { getState }) => {
        let user = getState() as UserStats;

        user.lastActivity = timestamp;
        await AppDatabase.updateUser(user);

        return timestamp;
    }
);

export const updateNotifications = createAsyncThunk(
    'user/updateNotifications',
    async (
        {
            gameSound,
            browser,
            email,
        }: { wallet: string; gameSound: boolean; browser: boolean; email?: string },
        { getState }
    ) => {
        let user = getState() as UserStats;

        user.notifications = { gameSound, browser, email };
        await AppDatabase.updateUser(user);

        return user.notifications;
    }
);

export default userSlice.reducer;
