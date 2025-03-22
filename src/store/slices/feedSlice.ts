// store/slices/feedSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedImageData {
  id: string;
  url: string;
  isLocalFile: boolean;
}

export interface SectionData {
  id: string;
  caption: string;
  description: string;
  images: FeedImageData[];
}

export interface GalleryPageData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: SectionData[];
}

interface FeedState {
  feedData: GalleryPageData | null;
}

const initialState: FeedState = {
  feedData: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedData: (state, action: PayloadAction<GalleryPageData>) => {
      state.feedData = action.payload;
    },
    clearFeedData: (state) => {
      state.feedData = null;
    },
  },
});

export const { setFeedData, clearFeedData } = feedSlice.actions;
export default feedSlice.reducer;
