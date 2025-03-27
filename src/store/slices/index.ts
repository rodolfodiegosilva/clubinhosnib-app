import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import feedReducer from './gallery/gallerySlice';
import routesReducer from './route/routeSlice';
import videoReducer from './video/videoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    routes: routesReducer,
    video: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;