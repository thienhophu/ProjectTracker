import { configureStore } from "@reduxjs/toolkit";

import counterSlice from "../features/counter/counterSlice";
import projectsSlice from "../features/projects/projectsSlice";
import { pokemonApi } from "../services/pokemon";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    projects: projectsSlice,
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
