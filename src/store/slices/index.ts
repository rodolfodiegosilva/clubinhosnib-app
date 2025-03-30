// store/index.ts ou store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import feedReducer from './gallery/gallerySlice';
import routesReducer from './route/routeSlice';
import videoReducer from './video/videoSlice';
import studyMaterialReducer from './study-material/studyMaterialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    routes: routesReducer,
    video: videoReducer,
    studyMaterial: studyMaterialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
