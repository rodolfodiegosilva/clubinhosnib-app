import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import feedReducer from './gallery/gallerySlice';
import routesReducer from './route/routeSlice'; // <-- import novo

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    routes: routesReducer, // <-- adiciona aqui
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
