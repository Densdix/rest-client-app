import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import variablesSlice from './variablesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    variables: variablesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
