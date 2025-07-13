import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slice/user';

export const makeStore = () => {
    return configureStore({
        reducer: { userReducer },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
