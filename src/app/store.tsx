import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import counterSlice from '../features/counter/counterSlice';
import projectsSlice from '../features/projects/projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    counter: counterSlice,
    projects: projectsSlice,
  },
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
