import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteData } from "../route/routeSlice";

export interface VideoItem {
  id?: string;
  title: string;
  description: string;
  type: "upload" | "link";
  platform?: "youtube" | "googledrive" | "onedrive" | "ANY";
  url?: string;
  file?: File;
  isLocalFile?: boolean;
  createdAt?: string;
  updatedAt?: string;
  mediaType?: string;
  originalName?: string; // Adicionado
  size?: number; // Adicionado
}

export interface VideoPageData {
  id?: string;
  public: boolean;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  videos: VideoItem[];
  route?: RouteData;
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