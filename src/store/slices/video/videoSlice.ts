import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "google-drive" | "onedrive" | null;
  url: string;
}

export interface VideoPageData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  videos: VideoItem[];
}

interface VideoState {
  videoData: VideoPageData | null;
}

const initialState: VideoState = {
  videoData: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoData: (state, action: PayloadAction<VideoPageData>) => {
      state.videoData = action.payload;
    },
    clearVideoData: (state) => {
      state.videoData = null;
    },
  },
});

export const { setVideoData, clearVideoData } = videoSlice.actions;
export default videoSlice.reducer;