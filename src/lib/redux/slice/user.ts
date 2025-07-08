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
        builder.addCase(fetchUser.fulfilled, (_, action) => {
            return action.payload;
        });
        builder.addCase(addGame.fulfilled, (_, action) => {
            return action.payload;
        });
        builder.addCase(updateUserAppeareance.fulfilled, (_, action) => {
            return action.payload;
        });
        builder.addCase(updateLastActivity.fulfilled, (_, action) => {
            return action.payload;
        });
        builder.addCase(updateNotifications.fulfilled, (_, action) => {
            return action.payload;
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
        const userState = (getState() as any).userReducer as UserStats;

        const updatedUser = structuredClone(userState);
        updatedUser.games[gameType]++;
        updatedUser.points += REWARD_POINTS[gameType];

        await AppDatabase.updateUser(updatedUser);

        return updatedUser;
    }
);

export const updateUserAppeareance = createAsyncThunk(
    'user/updateUserAppeareance',
    async ({ name, avatar }: { name?: string; avatar?: string }, { getState }) => {
        const userState = (getState() as any).userReducer as UserStats;

        const updatedUser = structuredClone(userState);
        if (name) updatedUser.name = name;
        if (avatar) {
            const link = await AppDatabase.uploadAvatar(updatedUser.walletAddress, avatar);
            updatedUser.avatar = link;
        }
        await AppDatabase.updateUser(updatedUser);

        return updatedUser;
    }
);

export const updateNotifications = createAsyncThunk(
    'user/updateNotifications',
    async (
        { gameSound, browser, email }: { gameSound: boolean; browser: boolean; email?: string },
        { getState }
    ) => {
        const userState = (getState() as any).userReducer as UserStats;

        const updatedUser = structuredClone(userState);
        updatedUser.notifications = { gameSound, browser };
        if (email) updatedUser.notifications.email = email;
        await AppDatabase.updateUser(updatedUser);

        return updatedUser;
    }
);

export const updateLastActivity = createAsyncThunk(
    'user/updateLastActivity',
    async ({ timestamp }: { timestamp: Timestamp }, { getState }) => {
        const userState = (getState() as any).userReducer as UserStats;

        const updatedUser = structuredClone(userState);
        updatedUser.lastActivity = timestamp;
        await AppDatabase.updateUser(updatedUser);

        return updatedUser;
    }
);

export default userSlice.reducer;
